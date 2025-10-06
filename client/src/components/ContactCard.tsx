
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

interface ContactCardProps {
  id: number;
  name: string;
  role: string;
  company: string;
  category: string;
  whatsapp?: string;
  email?: string;
  tags?: string[];
}

export function ContactCard({ id, name, role, company, category, whatsapp, email, tags }: ContactCardProps) {
  const handleWhatsApp = () => {
    if (whatsapp) {
      // Remove any non-numeric characters except +
      const cleanNumber = whatsapp.replace(/[^\d+]/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`card-contact-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{name}</h3>
            <p className="text-xs text-muted-foreground truncate">{role}</p>
            <p className="text-xs text-muted-foreground truncate">{company}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs">{category}</Badge>
          {tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          {whatsapp && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleWhatsApp}
              data-testid={`button-whatsapp-${id}`}
            >
              <SiWhatsapp className="h-4 w-4" />
            </Button>
          )}
          {email && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleEmail}
              data-testid={`button-email-${id}`}
            >
              <Mail className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
