import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Heart, ThumbsUp, ThumbsDown, Frown, Angry, MessageCircle, Share2, MoreHorizontal, Trash2, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ForumPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profiles?: { display_name: string | null; avatar_url: string | null; full_name_arabic: string | null };
  reactions: { reaction_type: string; user_id: string }[];
  comments: ForumComment[];
}

interface ForumComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  created_at: string;
  profiles?: { display_name: string | null; avatar_url: string | null; full_name_arabic: string | null };
}

const REACTIONS = [
  { type: 'like', icon: ThumbsUp, label: '👍', color: 'text-blue-500' },
  { type: 'love', icon: Heart, label: '❤️', color: 'text-red-500' },
  { type: 'sad', icon: Frown, label: '😢', color: 'text-yellow-500' },
  { type: 'angry', icon: Angry, label: '😠', color: 'text-orange-500' },
  { type: 'dislike', icon: ThumbsDown, label: '👎', color: 'text-gray-500' },
];

const Forum: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const isRTL = language === 'ar';

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyTo, setReplyTo] = useState<{ postId: string; commentId: string; userName: string } | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    const { data: postsData } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!postsData) return;

    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_url, full_name_arabic')
      .in('user_id', userIds);

    const postIds = postsData.map(p => p.id);
    
    const { data: reactions } = await supabase
      .from('forum_reactions')
      .select('*')
      .in('post_id', postIds);

    const { data: comments } = await supabase
      .from('forum_comments')
      .select('*')
      .in('post_id', postIds)
      .order('created_at', { ascending: true });

    const commentUserIds = comments ? [...new Set(comments.map(c => c.user_id))] : [];
    const allUserIds = [...new Set([...userIds, ...commentUserIds])];
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_url, full_name_arabic')
      .in('user_id', allUserIds);

    const profileMap = new Map((allProfiles || []).map(p => [p.user_id, p]));

    const enrichedPosts: ForumPost[] = postsData.map(post => ({
      ...post,
      profiles: profileMap.get(post.user_id) || undefined,
      reactions: (reactions || []).filter(r => r.post_id === post.id),
      comments: (comments || []).filter(c => c.post_id === post.id).map(c => ({
        ...c,
        profiles: profileMap.get(c.user_id) || undefined,
      })),
    }));

    setPosts(enrichedPosts);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    fetchPosts();

    const channel = supabase
      .channel('forum-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_posts' }, () => fetchPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_reactions' }, () => fetchPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_comments' }, () => fetchPosts())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, navigate, fetchPosts]);

  const createPost = async () => {
    if (!newPostContent.trim() || !user) return;
    setPosting(true);
    const { error } = await supabase.from('forum_posts').insert({
      user_id: user.id,
      content: newPostContent.trim(),
    });
    if (error) {
      toast({ title: isRTL ? 'خطأ' : '오류', description: error.message, variant: 'destructive' });
    } else {
      setNewPostContent('');
      toast({ title: isRTL ? 'تم النشر!' : '게시됨!' });
    }
    setPosting(false);
  };

  const toggleReaction = async (postId: string, reactionType: string) => {
    if (!user) return;
    const existing = posts.find(p => p.id === postId)?.reactions.find(
      r => r.user_id === user.id && r.reaction_type === reactionType
    );
    if (existing) {
      await supabase.from('forum_reactions').delete()
        .eq('post_id', postId).eq('user_id', user.id).eq('reaction_type', reactionType);
    } else {
      await supabase.from('forum_reactions').insert({
        post_id: postId, user_id: user.id, reaction_type: reactionType,
      });
    }
    setShowReactions(null);
  };

  const addComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content || !user) return;
    await supabase.from('forum_comments').insert({
      post_id: postId,
      user_id: user.id,
      content,
      parent_comment_id: replyTo?.postId === postId ? replyTo.commentId : null,
    });
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setReplyTo(null);
  };

  const deletePost = async (postId: string) => {
    await supabase.from('forum_posts').delete().eq('id', postId);
  };

  const deleteComment = async (commentId: string) => {
    await supabase.from('forum_comments').delete().eq('id', commentId);
  };

  const sharePost = (post: ForumPost) => {
    const text = post.content.substring(0, 100);
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: isRTL ? 'منتدى خطوات سيول' : '서울 스텝스 포럼', text, url });
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
      window.open(waUrl, '_blank');
    }
  };

  const getUserName = (profiles?: { display_name: string | null; full_name_arabic: string | null }) => {
    if (!profiles) return isRTL ? 'مستخدم' : '사용자';
    return profiles.full_name_arabic || profiles.display_name || (isRTL ? 'مستخدم' : '사용자');
  };

  const getAvatar = (profiles?: { avatar_url: string | null; display_name: string | null }) => {
    if (profiles?.avatar_url) return profiles.avatar_url;
    return null;
  };

  const renderComments = (comments: ForumComment[], postId: string, parentId: string | null = null, depth = 0) => {
    const filtered = comments.filter(c => c.parent_comment_id === parentId);
    if (!filtered.length) return null;

    return filtered.map(comment => (
      <div key={comment.id} className={`${depth > 0 ? (isRTL ? 'mr-6 border-r-2' : 'ml-6 border-l-2') + ' border-primary/20 pr-3 pl-3' : ''}`}>
        <div className="flex items-start gap-2 py-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-xs font-bold shrink-0">
            {getAvatar(comment.profiles) ? (
              <img src={getAvatar(comment.profiles)!} alt="" className="w-full h-full rounded-full object-cover" />
            ) : getUserName(comment.profiles).charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">{getUserName(comment.profiles)}</span>
              <span className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: isRTL ? ar : undefined })}
              </span>
            </div>
            <p className="text-sm text-foreground/90 mt-0.5">{comment.content}</p>
            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={() => {
                  setReplyTo({ postId, commentId: comment.id, userName: getUserName(comment.profiles) });
                  setExpandedComments(prev => prev.includes(postId) ? prev : [...prev, postId]);
                }}
                className="text-[10px] text-primary hover:underline"
              >
                {isRTL ? 'رد' : '답글'}
              </button>
              {comment.user_id === user?.id && (
                <button onClick={() => deleteComment(comment.id)} className="text-[10px] text-destructive hover:underline">
                  {isRTL ? 'حذف' : '삭제'}
                </button>
              )}
            </div>
          </div>
        </div>
        {renderComments(comments, postId, comment.id, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {isRTL ? 'العودة' : '돌아가기'}
          </Button>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold">{isRTL ? 'المنتدى' : '포럼'}</h1>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* New Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 p-4 mb-6 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder={isRTL ? 'شارك أفكارك مع المتعلمين...' : '학습자들과 생각을 공유하세요...'}
                className="w-full min-h-[80px] bg-transparent border-none outline-none resize-none text-sm placeholder:text-muted-foreground"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div />
                <Button
                  onClick={createPost}
                  disabled={!newPostContent.trim() || posting}
                  size="sm"
                  className="gap-1.5 rounded-xl"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isRTL ? 'نشر' : '게시'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            {isRTL ? 'جاري التحميل...' : '로딩 중...'}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">{isRTL ? 'لا توجد منشورات بعد. كن أول من ينشر!' : '아직 게시물이 없습니다. 첫 게시물을 올려보세요!'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Post Header */}
                <div className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center font-bold text-sm overflow-hidden">
                        {getAvatar(post.profiles) ? (
                          <img src={getAvatar(post.profiles)!} alt="" className="w-full h-full object-cover" />
                        ) : getUserName(post.profiles).charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{getUserName(post.profiles)}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: isRTL ? ar : undefined })}
                        </p>
                      </div>
                    </div>
                    {post.user_id === user?.id && (
                      <button onClick={() => deletePost(post.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Reactions Summary */}
                {post.reactions.length > 0 && (
                  <div className="px-4 pb-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {[...new Set(post.reactions.map(r => r.reaction_type))].map(type => {
                        const reaction = REACTIONS.find(r => r.type === type);
                        const count = post.reactions.filter(r => r.reaction_type === type).length;
                        return (
                          <span key={type} className="flex items-center gap-0.5 bg-muted/50 px-1.5 py-0.5 rounded-full">
                            {reaction?.label} {count}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-4 py-2 border-t border-border/30 flex items-center justify-between">
                  <div className="relative flex items-center gap-1">
                    <button
                      onClick={() => setShowReactions(showReactions === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 text-xs text-muted-foreground transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {isRTL ? 'تفاعل' : '반응'}
                    </button>
                    
                    <AnimatePresence>
                      {showReactions === post.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          className="absolute bottom-full mb-1 left-0 bg-card border border-border rounded-2xl shadow-xl p-1.5 flex items-center gap-0.5 z-10"
                        >
                          {REACTIONS.map(reaction => {
                            const hasReacted = post.reactions.some(r => r.user_id === user?.id && r.reaction_type === reaction.type);
                            return (
                              <motion.button
                                key={reaction.type}
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleReaction(post.id, reaction.type)}
                                className={`text-xl p-1.5 rounded-lg transition-colors ${hasReacted ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                              >
                                {reaction.label}
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={() => setExpandedComments(prev => prev.includes(post.id) ? prev.filter(id => id !== post.id) : [...prev, post.id])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 text-xs text-muted-foreground transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.comments.length > 0 && post.comments.length}
                    {' '}{isRTL ? 'تعليق' : '댓글'}
                  </button>

                  <button
                    onClick={() => sharePost(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 text-xs text-muted-foreground transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    {isRTL ? 'مشاركة' : '공유'}
                  </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {expandedComments.includes(post.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border/30 overflow-hidden"
                    >
                      <div className="p-4 space-y-1">
                        {renderComments(post.comments, post.id)}
                        
                        {/* Reply indicator */}
                        {replyTo && replyTo.postId === post.id && (
                          <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-lg">
                            <span>{isRTL ? `رد على ${replyTo.userName}` : `${replyTo.userName}에게 답글`}</span>
                            <button onClick={() => setReplyTo(null)}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* Comment Input */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            value={commentInputs[post.id] || ''}
                            onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && addComment(post.id)}
                            placeholder={isRTL ? 'اكتب تعليقاً...' : '댓글을 입력하세요...'}
                            className="flex-1 bg-muted/50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30"
                            dir={isRTL ? 'rtl' : 'ltr'}
                          />
                          <Button size="sm" variant="ghost" onClick={() => addComment(post.id)} disabled={!commentInputs[post.id]?.trim()}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Forum;
