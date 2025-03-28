import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/shared/Button";
import { mobileNum, shopAddress, shopEmailId, shopOpenTime } from "../mockData";
import { sendMessage } from "../services/contactApi";

const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await sendMessage(formData);
      console.log("Email sent successfully!", response);
      toast.success("Your message has been sent successfully!"); // Success toast
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error.message);
      toast.error("Failed to send message. Please try again."); // Error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif text-center mb-12">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-serif mb-6">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {["name", "email", "message"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "message" ? "textarea" : field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder={`Your ${field}`}
                  rows={field === "message" ? "4" : undefined}
                />
              </div>
            ))}
            <Button
              label={isSubmitting ? "Sending..." : "Send Message"}
              classN="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              buttonType="submit"
              disabled={isSubmitting}
            />
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-serif mb-6">Visit Our Store</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                <span>{shopAddress}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-purple-600 mr-3" />
                <span>{mobileNum}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-purple-600 mr-3" />
                <span>{shopEmailId}</span>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-purple-600 mr-3 mt-1" />
                <div>
                  <p>{shopOpenTime.weekDays}</p>
                  <p>{shopOpenTime.weekend}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 h-64 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1527015175922-36a306cf0e20?auto=format&fit=crop&w=800"
                alt="Store Location"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
