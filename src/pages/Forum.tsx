import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Heart, ThumbsUp, ThumbsDown, Frown, Angry, MessageCircle, Share2, Trash2, X, Bookmark, Copy, Users, Sparkles, ExternalLink } from 'lucide-react';
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
  { type: 'like', label: '👍', color: 'text-blue-500' },
  { type: 'love', label: '❤️', color: 'text-red-500' },
  { type: 'sad', label: '😢', color: 'text-yellow-500' },
  { type: 'angry', label: '😠', color: 'text-orange-500' },
  { type: 'dislike', label: '👎', color: 'text-gray-500' },
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
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<{ display_name: string | null; avatar_url: string | null; full_name_arabic: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('display_name, avatar_url, full_name_arabic').eq('user_id', user.id).single().then(({ data }) => {
      if (data) setCurrentUserProfile(data);
    });
  }, [user]);

  const fetchPosts = useCallback(async () => {
    const { data: postsData } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!postsData) return;

    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const postIds = postsData.map(p => p.id);

    const [{ data: allProfiles }, { data: reactions }, { data: comments }] = await Promise.all([
      supabase.from('profiles').select('user_id, display_name, avatar_url, full_name_arabic').in('user_id', userIds),
      supabase.from('forum_reactions').select('*').in('post_id', postIds),
      supabase.from('forum_comments').select('*').in('post_id', postIds).order('created_at', { ascending: true }),
    ]);

    const commentUserIds = comments ? [...new Set(comments.map(c => c.user_id))] : [];
    const allIds = [...new Set([...userIds, ...commentUserIds])];
    let profileMap = new Map((allProfiles || []).map(p => [p.user_id, p]));

    if (commentUserIds.length > 0) {
      const { data: commentProfiles } = await supabase.from('profiles').select('user_id, display_name, avatar_url, full_name_arabic').in('user_id', allIds);
      profileMap = new Map((commentProfiles || allProfiles || []).map(p => [p.user_id, p]));
    }

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

    const optimisticPost: ForumPost = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      content: newPostContent.trim(),
      image_url: null,
      created_at: new Date().toISOString(),
      profiles: currentUserProfile || { display_name: user.email?.split('@')[0] || null, avatar_url: null, full_name_arabic: null },
      reactions: [],
      comments: [],
    };
    setPosts(prev => [optimisticPost, ...prev]);
    const content = newPostContent.trim();
    setNewPostContent('');

    const { error } = await supabase.from('forum_posts').insert({ user_id: user.id, content });
    if (error) {
      toast({ title: isRTL ? 'خطأ' : '오류', description: error.message, variant: 'destructive' });
      setPosts(prev => prev.filter(p => p.id !== optimisticPost.id));
    } else {
      toast({ title: isRTL ? 'تم النشر بنجاح! 🎉' : '게시됨! 🎉' });
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
      await supabase.from('forum_reactions').delete()
        .eq('post_id', postId).eq('user_id', user.id);
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

  const copyPostContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: isRTL ? 'تم النسخ!' : '복사됨!' });
  };

  const shareToWhatsApp = (post: ForumPost) => {
    const text = `${isRTL ? 'من منتدى خطوات سيول:' : '서울 스텝스 포럼에서:'}\n\n${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}\n\n${window.location.origin}/forum`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShowShareMenu(null);
  };

  const shareToFacebook = (post: ForumPost) => {
    const url = `${window.location.origin}/forum`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(post.content.substring(0, 100))}`, '_blank');
    setShowShareMenu(null);
  };

  const shareToTwitter = (post: ForumPost) => {
    const text = `${post.content.substring(0, 200)}\n${window.location.origin}/forum`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    setShowShareMenu(null);
  };

  const shareNative = async (post: ForumPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isRTL ? 'منتدى خطوات سيول' : '서울 스텝스 포럼',
          text: post.content.substring(0, 200),
          url: `${window.location.origin}/forum`,
        });
      } catch { /* user cancelled */ }
    }
    setShowShareMenu(null);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/forum`);
    toast({ title: isRTL ? 'تم نسخ الرابط!' : '링크 복사됨!' });
    setShowShareMenu(null);
  };

  const toggleSave = (postId: string) => {
    const isSaved = savedPosts.includes(postId);
    setSavedPosts(prev => isSaved ? prev.filter(id => id !== postId) : [...prev, postId]);
    toast({ title: isSaved ? (isRTL ? 'تم إلغاء الحفظ' : '저장 취소됨') : (isRTL ? 'تم الحفظ! 🔖' : '저장됨! 🔖') });
  };

  const getUserName = (profiles?: { display_name: string | null; full_name_arabic: string | null }) => {
    if (!profiles) return isRTL ? 'مستخدم' : '사용자';
    return profiles.full_name_arabic || profiles.display_name || (isRTL ? 'مستخدم' : '사용자');
  };

  const getAvatar = (profiles?: { avatar_url: string | null }) => profiles?.avatar_url || null;

  const renderComments = (comments: ForumComment[], postId: string, parentId: string | null = null, depth = 0) => {
    const filtered = comments.filter(c => c.parent_comment_id === parentId);
    if (!filtered.length) return null;

    return filtered.map(comment => (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`${depth > 0 ? (isRTL ? 'mr-5 border-r-2' : 'ml-5 border-l-2') + ' border-primary/15 px-3' : ''}`}
      >
        <div className="flex items-start gap-2 py-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden ring-1 ring-border/30">
            {getAvatar(comment.profiles) ? (
              <img src={getAvatar(comment.profiles)!} alt="" className="w-full h-full rounded-full object-cover" />
            ) : getUserName(comment.profiles).charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="bg-muted/40 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-foreground">{getUserName(comment.profiles)}</span>
                <span className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: isRTL ? ar : undefined })}
                </span>
              </div>
              <p className="text-sm text-foreground/85">{comment.content}</p>
            </div>
            <div className="flex items-center gap-3 mt-1 px-1">
              <button
                onClick={() => {
                  setReplyTo({ postId, commentId: comment.id, userName: getUserName(comment.profiles) });
                  setExpandedComments(prev => prev.includes(postId) ? prev : [...prev, postId]);
                }}
                className="text-[11px] text-primary font-medium hover:underline"
              >
                {isRTL ? '↩ رد' : '↩ 답글'}
              </button>
              {comment.user_id === user?.id && (
                <button onClick={() => deleteComment(comment.id)} className="text-[11px] text-destructive/70 hover:text-destructive hover:underline">
                  {isRTL ? 'حذف' : '삭제'}
                </button>
              )}
            </div>
          </div>
        </div>
        {renderComments(comments, postId, comment.id, depth + 1)}
      </motion.div>
    ));
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/40" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--background)), hsl(270 60% 55% / 0.04))' }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-1.5 text-muted-foreground hover:text-foreground">
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-sm">{isRTL ? 'العودة' : '돌아가기'}</span>
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                <MessageCircle className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground leading-tight">{isRTL ? 'المنتدى' : '포럼'}</h1>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">{posts.length} {isRTL ? 'منشور' : '게시물'}</p>
                </div>
              </div>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-5 max-w-2xl">
        {/* New Post Composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/40 p-4 mb-6 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shrink-0 overflow-hidden ring-2 ring-background">
              {currentUserProfile?.avatar_url ? (
                <img src={currentUserProfile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                getUserName(currentUserProfile || undefined).charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary mb-1.5">
                {getUserName(currentUserProfile || undefined)}
              </p>
              <textarea
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder={isRTL ? 'شارك أفكارك مع المتعلمين... 💭' : '학습자들과 생각을 공유하세요... 💭'}
                className="w-full min-h-[80px] bg-transparent border-none outline-none resize-none text-sm placeholder:text-muted-foreground leading-relaxed"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <div className="flex items-center justify-between pt-2.5 border-t border-border/20">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-muted-foreground">
                    {newPostContent.length > 0 && `${newPostContent.length} ${isRTL ? 'حرف' : '자'}`}
                  </p>
                  {newPostContent.length > 0 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Sparkles className="w-3 h-3 text-primary/50" />
                    </motion.div>
                  )}
                </div>
                <Button
                  onClick={createPost}
                  disabled={!newPostContent.trim() || posting}
                  size="sm"
                  className="gap-1.5 rounded-xl px-4"
                >
                  <Send className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                  {isRTL ? 'نشر' : '게시'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">{isRTL ? 'جاري التحميل...' : '로딩 중...'}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground font-medium">{isRTL ? 'لا توجد منشورات بعد' : '아직 게시물이 없습니다'}</p>
            <p className="text-sm text-muted-foreground/70 mt-1">{isRTL ? 'كن أول من ينشر!' : '첫 게시물을 올려보세요!'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-card rounded-2xl border border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Post Header */}
                <div className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/25 to-accent/25 flex items-center justify-center font-bold text-sm overflow-hidden ring-2 ring-background shadow-sm">
                        {getAvatar(post.profiles) ? (
                          <img src={getAvatar(post.profiles)!} alt="" className="w-full h-full object-cover" />
                        ) : getUserName(post.profiles).charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{getUserName(post.profiles)}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: isRTL ? ar : undefined })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => toggleSave(post.id)} className={`p-1.5 rounded-lg transition-colors ${savedPosts.includes(post.id) ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted/50'}`}>
                        <Bookmark className={`w-4 h-4 ${savedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button onClick={() => copyPostContent(post.content)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      {post.user_id === user?.id && (
                        <button onClick={() => deletePost(post.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive/60 hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{post.content}</p>
                </div>

                {/* Reactions Summary */}
                {post.reactions.length > 0 && (
                  <div className="px-4 pb-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                      {[...new Set(post.reactions.map(r => r.reaction_type))].map(type => {
                        const reaction = REACTIONS.find(r => r.type === type);
                        const count = post.reactions.filter(r => r.reaction_type === type).length;
                        const userReacted = post.reactions.some(r => r.reaction_type === type && r.user_id === user?.id);
                        return (
                          <motion.span
                            key={type}
                            whileHover={{ scale: 1.05 }}
                            className={`flex items-center gap-0.5 px-2.5 py-1 rounded-full cursor-pointer transition-all ${userReacted ? 'bg-primary/10 text-primary font-medium shadow-sm' : 'bg-muted/40 hover:bg-muted/60'}`}
                            onClick={() => toggleReaction(post.id, type)}
                          >
                            {reaction?.label} {count}
                          </motion.span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-3 py-2 border-t border-border/20 flex items-center justify-between">
                  <div className="relative flex items-center gap-0.5">
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
                          className="absolute bottom-full mb-2 start-0 bg-card border border-border rounded-2xl shadow-xl p-1.5 flex items-center gap-0.5 z-10"
                        >
                          {REACTIONS.map(reaction => {
                            const hasReacted = post.reactions.some(r => r.user_id === user?.id && r.reaction_type === reaction.type);
                            return (
                              <motion.button
                                key={reaction.type}
                                whileHover={{ scale: 1.4, y: -4 }}
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
                    {post.comments.length > 0 && <span className="font-medium">{post.comments.length}</span>}
                    {' '}{isRTL ? 'تعليق' : '댓글'}
                  </button>

                  {/* Share with dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(showShareMenu === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 text-xs text-muted-foreground transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      {isRTL ? 'مشاركة' : '공유'}
                    </button>

                    <AnimatePresence>
                      {showShareMenu === post.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 5 }}
                          className="absolute bottom-full mb-2 end-0 bg-card border border-border rounded-xl shadow-xl p-2 z-10 min-w-[160px]"
                        >
                          <button onClick={() => shareToWhatsApp(post)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 text-xs text-foreground transition-colors">
                            <span className="text-base">💬</span>
                            WhatsApp
                          </button>
                          <button onClick={() => shareToFacebook(post)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 text-xs text-foreground transition-colors">
                            <span className="text-base">📘</span>
                            Facebook
                          </button>
                          <button onClick={() => shareToTwitter(post)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 text-xs text-foreground transition-colors">
                            <span className="text-base">🐦</span>
                            Twitter / X
                          </button>
                          {navigator.share && (
                            <button onClick={() => shareNative(post)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 text-xs text-foreground transition-colors">
                              <ExternalLink className="w-3.5 h-3.5" />
                              {isRTL ? 'مشاركة أخرى' : '기타 공유'}
                            </button>
                          )}
                          <div className="border-t border-border/30 mt-1 pt-1">
                            <button onClick={copyLink} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 text-xs text-foreground transition-colors">
                              <Copy className="w-3.5 h-3.5" />
                              {isRTL ? 'نسخ الرابط' : '링크 복사'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {expandedComments.includes(post.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border/20 overflow-hidden"
                    >
                      <div className="p-4 space-y-1">
                        {post.comments.length > 0 ? (
                          renderComments(post.comments, post.id)
                        ) : (
                          <p className="text-center text-xs text-muted-foreground py-3">
                            {isRTL ? 'لا توجد تعليقات بعد. كن أول من يعلق!' : '아직 댓글이 없습니다. 첫 댓글을 남겨보세요!'}
                          </p>
                        )}

                        {/* Reply indicator */}
                        {replyTo && replyTo.postId === post.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-xs text-primary bg-primary/5 px-3 py-2 rounded-xl border border-primary/10"
                          >
                            <span>↩ {isRTL ? `رد على ${replyTo.userName}` : `${replyTo.userName}에게 답글`}</span>
                            <button onClick={() => setReplyTo(null)} className="hover:bg-primary/10 rounded-full p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        )}

                        {/* Comment Input */}
                        <div className="flex items-center gap-2 pt-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/25 to-accent/25 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                            {currentUserProfile?.avatar_url ? (
                              <img src={currentUserProfile.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : getUserName(currentUserProfile || undefined).charAt(0)}
                          </div>
                          <input
                            value={commentInputs[post.id] || ''}
                            onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && addComment(post.id)}
                            placeholder={replyTo?.postId === post.id ? (isRTL ? `رد على ${replyTo.userName}...` : `${replyTo.userName}에게 답글...`) : (isRTL ? 'اكتب تعليقاً...' : '댓글을 입력하세요...')}
                            className="flex-1 bg-muted/40 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30 border border-transparent focus:border-primary/20"
                            dir={isRTL ? 'rtl' : 'ltr'}
                          />
                          <Button size="sm" variant="ghost" onClick={() => addComment(post.id)} disabled={!commentInputs[post.id]?.trim()} className="rounded-xl">
                            <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
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

      {/* Close share/reactions when clicking outside */}
      {(showShareMenu || showReactions) && (
        <div className="fixed inset-0 z-[5]" onClick={() => { setShowShareMenu(null); setShowReactions(null); }} />
      )}
    </div>
  );
};

export default Forum;
