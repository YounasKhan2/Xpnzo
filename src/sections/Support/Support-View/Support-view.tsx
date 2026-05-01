import React from "react";
import FAQAccordion from "../FAQAccordion";
import ContactForm from "../ContactForm";
import Card from "../../../components/Card";
import { Mail, Phone, MapPin } from "lucide-react";

const SupportView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-text-primary m-0">
          Support Center
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <Card
          padding="md"
          hoverable
          className="flex flex-col items-center text-center p-6"
        >
          <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h4 className="font-bold text-text-primary m-0 mb-1">Email Us</h4>
          <p className="text-sm text-text-muted mb-3">
            Drop us a line anytime.
          </p>
          <a
            href="mailto:support@xpnzo.com"
            className="text-sm font-semibold text-primary hover:underline mt-auto"
          >
            support@xpnzo.com
          </a>
        </Card>

        <Card
          padding="md"
          hoverable
          className="flex flex-col items-center text-center p-6"
        >
          <div className="w-12 h-12 rounded-full bg-success-light text-success flex items-center justify-center mb-4">
            <Phone size={24} />
          </div>
          <h4 className="font-bold text-text-primary m-0 mb-1">Call Us</h4>
          <p className="text-sm text-text-muted mb-3">
            Mon-Fri from 8am to 5pm.
          </p>
          <a
            href="tel:+15551234567"
            className="text-sm font-semibold text-primary hover:underline mt-auto"
          >
            +1 (555) 123-4567
          </a>
        </Card>

        <Card
          padding="md"
          hoverable
          className="flex flex-col items-center text-center p-6"
        >
          <div className="w-12 h-12 rounded-full bg-info-light text-info flex items-center justify-center mb-4">
            <MapPin size={24} />
          </div>
          <h4 className="font-bold text-text-primary m-0 mb-1">Visit Us</h4>
          <p className="text-sm text-text-muted mb-3">
            Come say hello at our office HQ.
          </p>
          <span className="text-sm font-semibold text-primary mt-auto">
            100 Market St, SF, CA
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <FAQAccordion />
        </div>
        <div className="flex flex-col gap-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default SupportView;
