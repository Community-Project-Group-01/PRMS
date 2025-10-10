import React from "react";
import {
  FaHospital,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const FooterSection = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
    {children}
  </div>
);

const FooterLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="text-white/70 hover:text-white transition-colors duration-200">
      {children}
    </a>
  </li>
);

const ContactItem = ({ icon: Icon, children }) => (
  <div className="flex items-start space-x-3">
    <Icon className="w-4 h-4 mt-1 text-secondary-dark flex-shrink-0" />
    <span className="text-white/70 text-sm">{children}</span>
  </div>
);

const Footer = () => {
  const quickLinks = [
    { href: "/patients", label: "Patient Portal" },
    { href: "/records", label: "Medical Records" },
    { href: "/appointments", label: "Book Appointment" },
    { href: "/emergency", label: "Emergency Services" },
  ];

  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/accessibility", label: "Accessibility" },
  ];

  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <FaHospital className="w-8 h-8 text-secondary-dark" />
              <div>
                <h2 className="text-2xl font-bold">University Health System</h2>
                <p className="text-white/80 text-sm">
                  Comprehensive Patient Care
                </p>
              </div>
            </div>
            <p className="text-white/70 mb-6 max-w-md">
              Delivering exceptional healthcare services with advanced patient
              record management and compassionate medical care for our
              university community.
            </p>
            <div className="flex flex-wrap gap-4">
              <ContactItem icon={FaPhone}>(555) 123-4567</ContactItem>
              <ContactItem icon={FaEnvelope}>health@university.edu</ContactItem>
            </div>
          </div>

          {/* Quick Links */}
          <FooterSection title="Quick Links">
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </FooterSection>

          {/* Contact Info */}
          <FooterSection title="Contact Info">
            <div className="space-y-4">
              <ContactItem icon={FaMapMarkerAlt}>
                123 University Avenue
                <br />
                Medical Center Building
                <br />
                Campus, State 12345
              </ContactItem>
              <ContactItem icon={FaPhone}>
                Emergency: (555) 911-HELP
              </ContactItem>
              <ContactItem icon={FaEnvelope}>
                support@university.edu
              </ContactItem>
            </div>
          </FooterSection>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm text-center md:text-left">
            © {new Date().getFullYear()} University Health System. All rights
            reserved.
          </p>
          <nav className="flex space-x-6 mt-4 md:mt-0">
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/70 hover:text-white text-sm transition-colors duration-200">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
