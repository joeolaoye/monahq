import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
// Using Formspree for form submission
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required").max(200),
  phoneNumber: z.string().trim().min(1, "Phone number is required").max(50),
  email: z.string().trim().email("Invalid email address").max(255).optional().or(z.literal("")),
  website: z.string().trim().max(500).optional().or(z.literal("")),
  messagingPlatform: z.string().trim().max(100).optional().or(z.literal("")),
  businessSector: z.string().trim().max(200).optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const businessSectors = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Education",
  "Real Estate",
  "Hospitality",
  "Professional Services",
  "Other",
];

const messagingPlatforms = [
  "WhatsApp",
  "Telegram",
  "Messenger",
  "WeChat",
  "Signal",
  "Other",
];

export default function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const formspreeFormId = import.meta.env.VITE_FORMSPREE_FORM_ID as string | undefined;
      if (!formspreeFormId) {
        throw new Error("Missing Formspree form ID (VITE_FORMSPREE_FORM_ID)");
      }

      const response = await fetch(`https://formspree.io/f/${formspreeFormId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          businessName: data.businessName,
          phoneNumber: data.phoneNumber,
          email: data.email || "",
          website: data.website || "",
          messagingPlatform: data.messagingPlatform || "",
          businessSector: data.businessSector || "",
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Formspree submission failed: ${errText}`);
      }

      setIsSuccess(true);
      reset();
      
      toast({
        title: "Success!",
        description: "Thanks for signing up! We'll reach out soon.",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-card rounded-2xl p-8 shadow-strong text-center animate-fade-in">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2 text-card-foreground">Thank you!</h3>
        <p className="text-muted-foreground mb-6">We've received your information and will reach out soon.</p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-card rounded-2xl p-8 shadow-strong space-y-6">
      <div className="space-y-2">
        <Label htmlFor="businessName" className="text-card-foreground">
          Business Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="businessName"
          {...register("businessName")}
          placeholder="Enter your business name"
          className="bg-input border-border focus:ring-primary"
        />
        {errors.businessName && (
          <p className="text-sm text-destructive">{errors.businessName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-card-foreground">
          Phone Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          {...register("phoneNumber")}
          placeholder="+2348000000000"
          className="bg-input border-border focus:ring-primary"
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-card-foreground">Email Address</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="you@company.com"
          className="bg-input border-border focus:ring-primary"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="website" className="text-card-foreground">Business Website</Label>
        <Input
          id="website"
          type="url"
          {...register("website")}
          placeholder="https://yourwebsite.com"
          className="bg-input border-border focus:ring-primary"
        />
        {errors.website && (
          <p className="text-sm text-destructive">{errors.website.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="messagingPlatform" className="text-card-foreground">Preferred Messaging Platform</Label>
        <Select onValueChange={(value) => setValue("messagingPlatform", value)}>
          <SelectTrigger className="bg-input border-border focus:ring-primary">
            <SelectValue placeholder="Select a platform" />
          </SelectTrigger>
          <SelectContent>
            {messagingPlatforms.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.messagingPlatform && (
          <p className="text-sm text-destructive">{errors.messagingPlatform.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessSector" className="text-card-foreground">Business Sector</Label>
        <Select onValueChange={(value) => setValue("businessSector", value)}>
          <SelectTrigger className="bg-input border-border focus:ring-primary">
            <SelectValue placeholder="Select your sector" />
          </SelectTrigger>
          <SelectContent>
            {businessSectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.businessSector && (
          <p className="text-sm text-destructive">{errors.businessSector.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-6 rounded-xl transition-all shadow-elegant hover:shadow-strong"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Get Early Access"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        * Required fields
      </p>
    </form>
  );
}
