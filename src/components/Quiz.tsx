import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trophy, RotateCcw, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { quizQuestions } from '@/data/koreanData';
import confetti from 'canvas-confetti';

interface QuizProps {
  level: number;
  onComplete: (score: number, total: number, passed: boolean) => void;
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ level, onComplete, onBack }) => {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const questions = quizQuestions[`level${level}` as keyof typeof quizQuestions] || [];
  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const passingScore = Math.ceil(totalQuestions * 0.7);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = answer === question.correct;
    setAnswers([...answers, isCorrect]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      const finalScore = score + (selectedAnswer === question.correct ? 1 : 0) - (answers[currentQuestion] ? 1 : 0);
      const passed = finalScore >= passingScore;
      setShowResults(true);
      
      if (passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      onComplete(finalScore, totalQuestions, passed);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
  };

  if (showResults) {
    const finalScore = score;
    const passed = finalScore >= passingScore;

    return (
      <div className="korean-card text-center animate-scale-in max-w-lg mx-auto">
        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
          passed ? 'bg-korean-green/20' : 'bg-destructive/20'
        }`}>
          {passed ? (
            <Trophy className="w-12 h-12 text-korean-green" />
          ) : (
            <XCircle className="w-12 h-12 text-destructive" />
          )}
        </div>

        <h2 className="text-3xl font-bold mb-4">
          {passed ? t('congratulations') : t('tryAgain')}
        </h2>

        <p className="text-xl mb-2">
          {t('score')}: <span className="font-bold text-gradient">{finalScore}/{totalQuestions}</span>
        </p>

        <p className={`text-lg mb-6 font-semibold ${passed ? 'text-korean-green' : 'text-destructive'}`}>
          {passed ? t('passed') : t('failed')}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            {t('tryAgain')}
          </button>
          
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 korean-button"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('previous')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">{t('question')} {currentQuestion + 1}/{totalQuestions}</span>
          <span className="font-semibold text-korean-green">{t('score')}: {score}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="korean-card animate-scale-in">
        <h3 className="text-xl font-bold mb-6 text-center">
          {question.question}
        </h3>

        <div className="grid gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correct;
            
            let buttonClass = 'p-4 rounded-xl border-2 text-right font-korean text-lg transition-all duration-300 ';
            
            if (isAnswered) {
              if (isCorrect) {
                buttonClass += 'border-korean-green bg-green-50 text-korean-green';
              } else if (isSelected && !isCorrect) {
                buttonClass += 'border-destructive bg-red-50 text-destructive';
              } else {
                buttonClass += 'border-border bg-muted/50 text-muted-foreground';
              }
            } else {
              buttonClass += isSelected 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary hover:bg-primary/5';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && isCorrect && (
                    <CheckCircle className="w-6 h-6 text-korean-green" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-6 h-6 text-destructive" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className={`mt-4 p-4 rounded-xl text-center font-semibold animate-scale-in ${
            selectedAnswer === question.correct 
              ? 'bg-green-100 text-korean-green' 
              : 'bg-red-100 text-destructive'
          }`}>
            {selectedAnswer === question.correct ? t('correct') : `${t('incorrect')} - ${question.correct}`}
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full mt-4 korean-button animate-scale-in"
          >
            {currentQuestion < totalQuestions - 1 ? t('next') : t('finish')}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
