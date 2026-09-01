const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="admin-footer">
      <div className="footer-brand">
        <strong>Student Portal</strong>

        <span>Admin Panel</span>
      </div>

      <div className="footer-copy">
        © {currentYear} Student Portal
      </div>
    </footer>
  );
};

export default Footer;