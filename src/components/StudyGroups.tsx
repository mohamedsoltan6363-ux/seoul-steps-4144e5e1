import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Crown, MessageCircle, Trophy, Plus, Search,
  Star, Clock, ChevronRight, Lock, Unlock, Flame, Medal
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  points: number;
  streak: number;
  isLeader: boolean;
  isOnline: boolean;
}

interface StudyGroup {
  id: string;
  nameAr: string;
  nameKo: string;
  descriptionAr: string;
  descriptionKo: string;
  members: GroupMember[];
  maxMembers: number;
  level: number;
  weeklyGoal: number;
  weeklyProgress: number;
  isPrivate: boolean;
  createdAt: Date;
}

const mockGroups: StudyGroup[] = [
  {
    id: '1',
    nameAr: 'متعلمو الهانغول',
    nameKo: '한글 학습자',
    descriptionAr: 'مجموعة للمبتدئين في تعلم الكورية',
    descriptionKo: '한국어 초보자를 위한 그룹',
    members: [
      { id: '1', name: 'أحمد', avatar: '👨', points: 1200, streak: 15, isLeader: true, isOnline: true },
      { id: '2', name: '민수', avatar: '👩', points: 980, streak: 12, isLeader: false, isOnline: true },
      { id: '3', name: 'سارة', avatar: '👧', points: 850, streak: 8, isLeader: false, isOnline: false },
      { id: '4', name: '지현', avatar: '👦', points: 720, streak: 5, isLeader: false, isOnline: true },
    ],
    maxMembers: 10,
    level: 1,
    weeklyGoal: 500,
    weeklyProgress: 380,
    isPrivate: false,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    nameAr: 'خبراء K-Drama',
    nameKo: 'K-Drama 전문가',
    descriptionAr: 'تعلم الكورية من خلال الدراما',
    descriptionKo: '드라마로 한국어 배우기',
    members: [
      { id: '5', name: 'فاطمة', avatar: '👩', points: 2100, streak: 30, isLeader: true, isOnline: true },
      { id: '6', name: '수진', avatar: '👨', points: 1800, streak: 25, isLeader: false, isOnline: false },
    ],
    maxMembers: 8,
    level: 3,
    weeklyGoal: 800,
    weeklyProgress: 650,
    isPrivate: true,
    createdAt: new Date('2024-02-20'),
  },
];

const StudyGroups: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [groups] = useState<StudyGroup[]>(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredGroups = groups.filter(group => {
    const name = isRTL ? group.nameAr : group.nameKo;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getLevelBadge = (level: number) => {
    const levels = [
      { color: 'from-green-400 to-emerald-500', label: isRTL ? 'مبتدئ' : '초급' },
      { color: 'from-blue-400 to-cyan-500', label: isRTL ? 'متوسط' : '중급' },
      { color: 'from-purple-400 to-pink-500', label: isRTL ? 'متقدم' : '고급' },
    ];
    return levels[level - 1] || levels[0];
  };

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
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'تعلم مع الأصدقاء' : '친구와 함께 배우기'}
            </p>
          </div>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              {isRTL ? 'إنشاء مجموعة' : '그룹 만들기'}
            </motion.button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? 'إنشاء مجموعة جديدة' : '새 그룹 만들기'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input 
                placeholder={isRTL ? 'اسم المجموعة' : '그룹 이름'}
                className="text-lg"
              />
              <Input 
                placeholder={isRTL ? 'الوصف' : '설명'}
              />
              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                  <Unlock className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">{isRTL ? 'عامة' : '공개'}</span>
                </button>
                <button className="flex-1 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                  <Lock className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">{isRTL ? 'خاصة' : '비공개'}</span>
                </button>
              </div>
              <motion.button
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isRTL ? 'إنشاء' : '만들기'}
              </motion.button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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

      {/* Groups List */}
      <div className="space-y-4">
        {filteredGroups.map((group, index) => {
          const levelBadge = getLevelBadge(group.level);
          const progress = (group.weeklyProgress / group.weeklyGoal) * 100;
          
          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedGroup(selectedGroup?.id === group.id ? null : group)}
              className={`p-4 rounded-2xl cursor-pointer transition-all ${
                selectedGroup?.id === group.id
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl">
                    {group.isPrivate ? '🔒' : '👥'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">
                        {isRTL ? group.nameAr : group.nameKo}
                      </h4>
                      {group.isPrivate && (
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? group.descriptionAr : group.descriptionKo}
                    </p>
                  </div>
                </div>
                
                <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${levelBadge.color} text-white`}>
                  {levelBadge.label}
                </span>
              </div>

              {/* Weekly Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {isRTL ? 'هدف الأسبوع' : '주간 목표'}
                  </span>
                  <span className="font-medium">
                    {group.weeklyProgress}/{group.weeklyGoal} pts
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Members Preview */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 4).map((member) => (
                      <div
                        key={member.id}
                        className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-sm ${
                          member.isOnline ? 'bg-green-100' : 'bg-muted'
                        }`}
                      >
                        {member.avatar}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    {group.members.length}/{group.maxMembers}
                  </span>
                </div>
                
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                  selectedGroup?.id === group.id ? 'rotate-90' : ''
                }`} />
              </div>

              {/* Expanded View */}
              <AnimatePresence>
                {selectedGroup?.id === group.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t"
                  >
                    <h5 className="font-semibold mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      {isRTL ? 'قائمة المتصدرين' : '리더보드'}
                    </h5>
                    
                    <div className="space-y-2">
                      {group.members
                        .sort((a, b) => b.points - a.points)
                        .map((member, idx) => (
                          <div
                            key={member.id}
                            className={`flex items-center justify-between p-3 rounded-xl ${
                              idx === 0 ? 'bg-amber-500/10' : 'bg-muted/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-muted-foreground w-6">
                                {idx + 1}
                              </span>
                              <div className="relative">
                                <span className="text-2xl">{member.avatar}</span>
                                {member.isOnline && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{member.name}</span>
                                  {member.isLeader && (
                                    <Crown className="w-4 h-4 text-amber-500" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Flame className="w-3 h-3 text-orange-500" />
                                  <span>{member.streak} days</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-bold text-primary">{member.points}</p>
                              <p className="text-xs text-muted-foreground">pts</p>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <motion.button
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        {isRTL ? 'المحادثة' : '채팅'}
                      </motion.button>
                      <motion.button
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-muted text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Medal className="w-4 h-4" />
                        {isRTL ? 'التحديات' : '챌린지'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">
            {isRTL ? 'لا توجد مجموعات' : '그룹이 없습니다'}
          </h3>
          <p className="text-muted-foreground">
            {isRTL ? 'أنشئ مجموعتك الأولى!' : '첫 번째 그룹을 만들어 보세요!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudyGroups;
