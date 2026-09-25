import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { PublicLayout } from './components/public/PublicLayout';
import { PortalShell } from './components/portal/PortalShell';
import { RequireAuth } from './components/portal/RequireAuth';

import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Academics } from './pages/public/Academics';
import { Admissions } from './pages/public/Admissions';
import { Apply } from './pages/public/Apply';
import { TrackApplication } from './pages/public/TrackApplication';
import { BookVisit } from './pages/public/BookVisit';
import { SchoolLife } from './pages/public/SchoolLife';
import { NewsEvents } from './pages/public/NewsEvents';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';
import { NotFound } from './pages/public/NotFound';

import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentChildren } from './pages/parent/ParentChildren';
import { ChildProfile } from './pages/parent/ChildProfile';
import { ParentFees } from './pages/parent/ParentFees';
import { ParentMessages } from './pages/parent/ParentMessages';
import { ParentEvents } from './pages/parent/ParentEvents';
import { ParentProfile } from './pages/parent/ParentProfile';

import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentLearning } from './pages/student/StudentLearning';
import { StudentSubject } from './pages/student/StudentSubject';
import { StudentLesson } from './pages/student/StudentLesson';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentAssignment } from './pages/student/StudentAssignment';
import { StudentQuiz } from './pages/student/StudentQuiz';
import { StudentProgress } from './pages/student/StudentProgress';
import { StudentAchievements } from './pages/student/StudentAchievements';
import { StudentProfile } from './pages/student/StudentProfile';

import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherClasses } from './pages/teacher/TeacherClasses';
import { TeacherClassDetail } from './pages/teacher/TeacherClassDetail';
import { TeacherStudents } from './pages/teacher/TeacherStudents';
import { TeacherAssignments } from './pages/teacher/TeacherAssignments';
import { AssignmentCreator } from './pages/teacher/AssignmentCreator';
import { GradingInterface } from './pages/teacher/GradingInterface';
import { TeacherResults } from './pages/teacher/TeacherResults';
import { TeacherGroups } from './pages/teacher/TeacherGroups';
import { TeacherAttendance } from './pages/teacher/TeacherAttendance';
import { TeacherTopics } from './pages/teacher/TeacherTopics';
import { TeacherMessages } from './pages/teacher/TeacherMessages';
import { TeacherCalendar } from './pages/teacher/TeacherCalendar';
import { TeacherHR } from './pages/teacher/TeacherHR';
import { TeacherProfile } from './pages/teacher/TeacherProfile';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAdmissions } from './pages/admin/AdminAdmissions';
import { AdminCRM } from './pages/admin/AdminCRM';
import { AdminLead } from './pages/admin/AdminLead';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminStudentProfile } from './pages/admin/AdminStudentProfile';
import { AdminParents } from './pages/admin/AdminParents';
import { AdminTeachers } from './pages/admin/AdminTeachers';
import { AdminClasses } from './pages/admin/AdminClasses';
import { AdminAcademics } from './pages/admin/AdminAcademics';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminCommunication } from './pages/admin/AdminCommunication';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

import { FinancePortal } from './pages/finance/FinancePortal';
import { HRPortal } from './pages/hr/HRPortal';

import { SuperDashboard } from './pages/super/SuperDashboard';
import { SuperSchools } from './pages/super/SuperSchools';
import { SuperSchoolDetail } from './pages/super/SuperSchoolDetail';
import { SuperUsers } from './pages/super/SuperUsers';
import { SuperModules } from './pages/super/SuperModules';
import { SuperAudit } from './pages/super/SuperAudit';
import { SuperSettings } from './pages/super/SuperSettings';

type DemoRole =
'visitor' |
'parent' |
'student' |
'classteacher' |
'subjectteacher' |
'hr' |
'finance' |
'admin' |
'superadmin';

export function App({ initialRole = 'visitor' }: {initialRole?: DemoRole;}) {
  return (
    <AppProvider initialRole={initialRole}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/track" element={<TrackApplication />} />
            <Route path="/visit" element={<BookVisit />} />
            <Route path="/school-life" element={<SchoolLife />} />
            <Route path="/news" element={<NewsEvents />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<RequireAuth><PortalShell /></RequireAuth>}>
            {/* Parent */}
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/parent/children" element={<ParentChildren />} />
            <Route path="/parent/child/:id" element={<ChildProfile />} />
            <Route path="/parent/child/:id/:tab" element={<ChildProfile />} />
            <Route path="/parent/fees" element={<ParentFees />} />
            <Route path="/parent/messages" element={<ParentMessages />} />
            <Route path="/parent/events" element={<ParentEvents />} />
            <Route path="/parent/profile" element={<ParentProfile />} />

            {/* Student */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/learning" element={<StudentLearning />} />
            <Route path="/student/subject/:slug" element={<StudentSubject />} />
            <Route path="/student/lesson" element={<StudentLesson />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
            <Route path="/student/assignment/:id" element={<StudentAssignment />} />
            <Route path="/student/quiz" element={<StudentQuiz />} />
            <Route path="/student/progress" element={<StudentProgress />} />
            <Route path="/student/achievements" element={<StudentAchievements />} />
            <Route path="/student/profile" element={<StudentProfile />} />

            {/* Teacher */}
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/classes" element={<TeacherClasses />} />
            <Route path="/teacher/class/:id" element={<TeacherClassDetail />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/assignments" element={<TeacherAssignments />} />
            <Route path="/teacher/assignments/new" element={<AssignmentCreator />} />
            <Route path="/teacher/assignment/:id/grade" element={<GradingInterface />} />
            <Route path="/teacher/results" element={<TeacherResults />} />
            <Route path="/teacher/groups" element={<TeacherGroups />} />
            <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            <Route path="/teacher/topics" element={<TeacherTopics />} />
            <Route path="/teacher/messages" element={<TeacherMessages />} />
            <Route path="/teacher/calendar" element={<TeacherCalendar />} />
            <Route path="/teacher/hr" element={<Navigate to="/teacher/hr/My attendance" replace />} />
            <Route path="/teacher/hr/:tab" element={<TeacherHR />} />
            <Route path="/teacher/profile" element={<TeacherProfile />} />

            {/* School admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/admissions" element={<AdminAdmissions />} />
            <Route path="/admin/crm" element={<AdminCRM />} />
            <Route path="/admin/crm/:id" element={<AdminLead />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/student/:id" element={<AdminStudentProfile />} />
            <Route path="/admin/parents" element={<AdminParents />} />
            <Route path="/admin/teachers" element={<AdminTeachers />} />
            <Route path="/admin/classes" element={<AdminClasses />} />
            <Route path="/admin/academics" element={<AdminAcademics />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/admin/communication" element={<AdminCommunication />} />
            <Route path="/admin/content/:tab" element={<AdminContent />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Finance & HR */}
            <Route path="/finance/:tab" element={<FinancePortal />} />
            <Route path="/hr/:tab" element={<HRPortal />} />

            {/* Super admin */}
            <Route path="/super" element={<SuperDashboard />} />
            <Route path="/super/schools" element={<SuperSchools />} />
            <Route path="/super/school/:id" element={<SuperSchoolDetail />} />
            <Route path="/super/users/:tab" element={<SuperUsers />} />
            <Route path="/super/modules" element={<SuperModules />} />
            <Route path="/super/audit/:tab" element={<SuperAudit />} />
            <Route path="/super/settings/:tab" element={<SuperSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>);

}