
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store contact form submission in Supabase
      const { error } = await supabase.from("contact_messages").insert({
        name,
        email,
        subject,
        message,
        status: "unread"
      });
      
      if (error) throw error;
      
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Contact Us</h1>
          <p className="text-lg text-blue-700">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Get in Touch</CardTitle>
              <CardDescription>
                Fill out the form and our team will get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="font-medium text-gray-700">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="font-medium text-gray-700">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="font-medium text-gray-700">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="font-medium text-gray-700">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message here..."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-700 hover:bg-blue-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Contact Information</CardTitle>
              <CardDescription>
                Reach out to us through these channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Email</h3>
                <p className="text-gray-700">support@sahiraah.in</p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Phone</h3>
                <p className="text-gray-700">+91 6361749943</p>
              </div>

              <div>
                <h3 className="font-medium text-blue-800 mb-1">Address</h3>
                <address className="not-italic text-gray-700">
                  123 Career Avenue<br />
                  Bangalore, Karnataka 560001<br />
                  India
                </address>
              </div>

              <div>
                <h3 className="font-medium text-blue-800 mb-1">Office Hours</h3>
                <p className="text-gray-700">Monday - Friday: 9am - 5pm IST</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
