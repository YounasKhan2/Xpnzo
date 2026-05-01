import React from "react";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Send, MessageSquare } from "lucide-react";

const ContactForm: React.FC = () => {
  return (
    <Card padding="lg" className="h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
          <MessageSquare size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary m-0">
            Contact Us
          </h3>
          <p className="text-sm text-text-muted mt-0.5">
            We typically reply within 24 hours.
          </p>
        </div>
      </div>

      <form className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Your Name" placeholder="John Doe" />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-primary font-body">
            Subject
          </label>
          <select className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-bg text-text-primary text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10">
            <option value="general">General Inquiry</option>
            <option value="billing">Billing Issue</option>
            <option value="technical">Technical Support</option>
            <option value="feedback">Feature Request / Feedback</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-primary font-body">
            Message
          </label>
          <textarea
            rows={5}
            className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-bg text-text-primary text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 resize-none"
            placeholder="How can we help you?"
          ></textarea>
        </div>

        <div className="pt-2 mt-2">
          <Button
            type="button"
            variant="primary"
            fullWidth
            icon={<Send size={16} />}
          >
            Send Message
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ContactForm;
