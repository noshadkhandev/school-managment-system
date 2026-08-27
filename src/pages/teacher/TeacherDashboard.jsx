
import TeacherStats from "./TeacherStats";
import QuickActions from "./QuickActions";
import TodayClasses from "./TodayClasses";
import RecentAssignments from "./RecentAssignments";
import AttendanceSummary from "./AttendanceSummary";


function TeacherDashboard() {
  return (
    <div className="teacher-layout">
   

      <main className="teacher-main1">
        <div className="teacher-dashboard">
          <div className="dashboard-header">
            <h1>Welcome To Dashboard</h1>
    
          </div>

          <TeacherStats />

          <QuickActions />

          <TodayClasses />

          <RecentAssignments />

          <AttendanceSummary />
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;