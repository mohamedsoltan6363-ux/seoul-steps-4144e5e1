import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Crown, MessageCircle, Trophy, Plus, Search,
  Star, Clock, ChevronRight, Lock, Unlock, Flame, Medal,
  Send, ArrowLeft, Loader2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface StudyGroupRow {
  id: string;
  name: string;
  description: string | null;
  level: number;
  max_members: number;
  weekly_goal: number;
  is_private: boolean;
  owner_user_id: string;
  created_at: string;
}

interface MemberRow {
  id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
}

interface MessageRow {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

const StudyGroups: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { user } = useAuth();
  
  const [groups, setGroups] = useState<StudyGroupRow[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroupRow | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupPrivate, setNewGroupPrivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatView, setChatView] = useState(false);
  const [memberCount, setMemberCount] = useState<Record<string, number>>({});

  // Load groups
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('study_groups').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setGroups(data);
      // Load member counts
      const counts: Record<string, number> = {};
      for (const g of data) {
        const { count } = await supabase.from('study_group_members').select('*', { count: 'exact', head: true }).eq('group_id', g.id);
        counts[g.id] = count || 0;
      }
      setMemberCount(counts);
    }
    setLoading(false);
  };

  const createGroup = async () => {
    if (!user || !newGroupName.trim()) return;
    const { data, error } = await supabase.from('study_groups').insert({
      name: newGroupName,
      description: newGroupDesc || null,
      is_private: newGroupPrivate,
      owner_user_id: user.id,
    }).select().single();
    
    if (error) {
      toast.error(isRTL ? 'خطأ في إنشاء المجموعة' : '그룹 생성 오류');
      return;
    }
    
    // Auto-join as owner
    await supabase.from('study_group_members').insert({
      group_id: data.id,
      user_id: user.id,
      role: 'owner' as const,
    });
    
    toast.success(isRTL ? 'تم إنشاء المجموعة!' : '그룹이 생성되었습니다!');
    setShowCreateForm(false);
    setNewGroupName('');
    setNewGroupDesc('');
    loadGroups();
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;
    const { error } = await supabase.from('study_group_members').insert({
      group_id: groupId,
      user_id: user.id,
    });
    if (error) {
      if (error.message.includes('full')) {
        toast.error(isRTL ? 'المجموعة ممتلئة' : '그룹이 가득 찼습니다');
      } else {
        toast.error(isRTL ? 'خطأ في الانضمام' : '가입 오류');
      }
      return;
    }
    toast.success(isRTL ? 'تم الانضمام!' : '가입했습니다!');
    loadGroups();
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;
    await supabase.from('study_group_members').delete().eq('group_id', groupId).eq('user_id', user.id);
    toast.success(isRTL ? 'تم المغادرة' : '탈퇴했습니다');
    setChatView(false);
    setSelectedGroup(null);
    loadGroups();
  };

  const openChat = async (group: StudyGroupRow) => {
    setSelectedGroup(group);
    setChatView(true);
    // Load members
    const { data: m } = await supabase.from('study_group_members').select('*').eq('group_id', group.id);
    setMembers(m || []);
    // Load messages
    const { data: msgs } = await supabase.from('study_group_messages').select('*').eq('group_id', group.id).order('created_at', { ascending: true }).limit(100);
    setMessages(msgs || []);
  };

  const sendMessage = async () => {
    if (!user || !selectedGroup || !newMessage.trim()) return;
    const { error } = await supabase.from('study_group_messages').insert({
      group_id: selectedGroup.id,
      user_id: user.id,
      content: newMessage.trim(),
    });
    if (!error) {
      setNewMessage('');
      // Reload messages
      const { data: msgs } = await supabase.from('study_group_messages').select('*').eq('group_id', selectedGroup.id).order('created_at', { ascending: true }).limit(100);
      setMessages(msgs || []);
    }
  };

  const isUserMember = (groupId: string) => {
    // We check via counts/ownership for simplicity
    return false; // Will be enhanced with real membership check
  };

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getLevelBadge = (level: number) => {
    const levels = [
      { color: 'from-green-400 to-emerald-500', label: isRTL ? 'مبتدئ' : '초급' },
      { color: 'from-blue-400 to-cyan-500', label: isRTL ? 'متوسط' : '중급' },
      { color: 'from-purple-400 to-pink-500', label: isRTL ? 'متقدم' : '고급' },
    ];
    return levels[Math.min(level - 1, 2)] || levels[0];
  };

  if (!user) {
    return (
      <div className="text-center py-12" dir={isRTL ? 'rtl' : 'ltr'}>
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-bold mb-2">{isRTL ? 'سجل الدخول أولاً' : '먼저 로그인하세요'}</h3>
        <p className="text-muted-foreground">{isRTL ? 'يجب تسجيل الدخول للانضمام للمجموعات' : '그룹에 가입하려면 로그인이 필요합니다'}</p>
      </div>
    );
  }

  // Chat View
  if (chatView && selectedGroup) {
    return (
      <div className="flex flex-col h-[70vh]" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <motion.button onClick={() => setChatView(false)} whileTap={{ scale: 0.9 }}>
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex-1">
            <h4 className="font-bold">{selectedGroup.name}</h4>
            <p className="text-xs text-muted-foreground">{members.length} {isRTL ? 'عضو' : '멤버'}</p>
          </div>
          <motion.button 
            onClick={() => leaveGroup(selectedGroup.id)}
            className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-500"
            whileHover={{ scale: 1.05 }}
          >
            {isRTL ? 'مغادرة' : '탈퇴'}
          </motion.button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{isRTL ? 'لا توجد رسائل بعد' : '아직 메시지가 없습니다'}</p>
            </div>
          )}
          {messages.map((msg) => {
            const isOwn = msg.user_id === user.id;
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  isOwn 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                    : 'bg-muted'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/60' : 'text-muted-foreground'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isRTL ? 'اكتب رسالة...' : '메시지 입력...'}
            className="flex-1 rounded-xl"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <motion.button
            onClick={sendMessage}
            className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">{isRTL ? 'مجموعات الدراسة' : '스터디 그룹'}</h3>
            <p className="text-xs text-muted-foreground">{isRTL ? 'تعلم مع الأصدقاء' : '친구와 함께 배우기'}</p>
          </div>
        </div>
        
        <motion.button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          {isRTL ? 'إنشاء' : '만들기'}
        </motion.button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 p-4 bg-muted/30 rounded-2xl border"
          >
            <Input 
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder={isRTL ? 'اسم المجموعة' : '그룹 이름'}
              className="text-lg rounded-xl"
            />
            <Input 
              value={newGroupDesc}
              onChange={(e) => setNewGroupDesc(e.target.value)}
              placeholder={isRTL ? 'الوصف (اختياري)' : '설명 (선택사항)'}
              className="rounded-xl"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setNewGroupPrivate(false)}
                className={`flex-1 py-3 rounded-xl transition-colors ${!newGroupPrivate ? 'bg-indigo-500 text-white' : 'bg-muted hover:bg-muted/80'}`}
              >
                <Unlock className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">{isRTL ? 'عامة' : '공개'}</span>
              </button>
              <button 
                onClick={() => setNewGroupPrivate(true)}
                className={`flex-1 py-3 rounded-xl transition-colors ${newGroupPrivate ? 'bg-indigo-500 text-white' : 'bg-muted hover:bg-muted/80'}`}
              >
                <Lock className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">{isRTL ? 'خاصة' : '비공개'}</span>
              </button>
            </div>
            <motion.button
              onClick={createGroup}
              disabled={!newGroupName.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRTL ? 'إنشاء المجموعة' : '그룹 만들기'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder={isRTL ? 'ابحث عن مجموعة...' : '그룹 검색...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
        </div>
      )}

      {/* Groups List */}
      <div className="space-y-4">
        {filteredGroups.map((group, index) => {
          const levelBadge = getLevelBadge(group.level);
          const count = memberCount[group.id] || 0;
          const isOwner = group.owner_user_id === user.id;
          
          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl">
                    {group.is_private ? '🔒' : '👥'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">{group.name}</h4>
                      {isOwner && <Crown className="w-4 h-4 text-amber-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{group.description || (isRTL ? 'بدون وصف' : '설명 없음')}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${levelBadge.color} text-white`}>
                  {levelBadge.label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {count}/{group.max_members} {isRTL ? 'أعضاء' : '멤버'}
                </span>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => openChat(group)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {isRTL ? 'دخول' : '입장'}
                  </motion.button>
                  {!isOwner && (
                    <motion.button
                      onClick={() => joinGroup(group.id)}
                      className="px-4 py-2 rounded-xl bg-muted text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isRTL ? 'انضمام' : '가입'}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty */}
      {!loading && filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">{isRTL ? 'لا توجد مجموعات' : '그룹이 없습니다'}</h3>
          <p className="text-muted-foreground">{isRTL ? 'أنشئ مجموعتك الأولى!' : '첫 번째 그룹을 만들어 보세요!'}</p>
        </div>
      )}
    </div>
  );
};

export default StudyGroups;
