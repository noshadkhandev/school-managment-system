import {
  Users,
  UserCheck,
  UserPlus,
  GraduationCap,
} from "lucide-react";

const iconMap = {
  users: Users,
  active: UserCheck,
  new: UserPlus,
  students: GraduationCap,
};

const StatCard = ({
  title = "Total Students",
  value = "0",
  subtitle = "",
  icon = "users",
  color = "blue",
}) => {
  const Icon = iconMap[icon] || Users;

  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${color}`}>
        <Icon size={24} />
      </div>

      <div className="stat-card-content">
        <span className="stat-card-title">
          {title}
        </span>

        <h2 className="stat-card-value">
          {value}
        </h2>

        {subtitle && (
          <p className="stat-card-subtitle">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;