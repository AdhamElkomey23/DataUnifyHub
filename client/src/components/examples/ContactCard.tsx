import { ContactCard } from "../ContactCard";

export default function ContactCardExample() {
  return (
    <div className="p-6 max-w-xs">
      <ContactCard
        id="1"
        name="Ahmed Hassan"
        role="Tour Guide"
        company="Desert Adventures"
        category="Guide"
        whatsapp="+971501234567"
        email="ahmed@desertadv.com"
        tags={["reliable", "preferred"]}
      />
    </div>
  );
}
