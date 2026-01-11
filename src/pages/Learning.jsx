import React from 'react';
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  CheckCircle,
  Star
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';

export default function Learning() {
  const courses = [
    {
      title: 'Business Credit Basics',
      lessons: 5,
      completed: 5,
      progress: 100
    },
    {
      title: 'Understanding Banking Fees',
      lessons: 4,
      completed: 2,
      progress: 50
    },
    {
      title: 'SBA Loan Application',
      lessons: 6,
      completed: 0,
      progress: 0
    }
  ];

  const achievements = [
    { title: 'First Health Check', icon: '\ud83c\udfc6' },
    { title: 'Credit Basics', icon: '\ud83d\udcda' },
  ];

  return (
    <DashboardLayout title="Learning Progress" subtitle="Track your financial education journey">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((course) => (
              <div 
                key={course.title}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{course.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {course.completed} of {course.lessons} lessons completed
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary">{course.progress}%</span>
                  </div>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-5">
              {achievements.map((achievement) => (
                <Badge 
                  key={achievement.title}
                  className="bg-gradient-to-r from-accent to-yellow-500 text-accent-foreground px-3 py-1.5 text-xs font-semibold"
                >
                  {achievement.icon} {achievement.title}
                </Badge>
              ))}
            </div>

            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-accent" />
                <div>
                  <p className="font-semibold text-sm">Keep Learning!</p>
                  <p className="text-xs text-muted-foreground">
                    Complete more courses to unlock achievements
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
