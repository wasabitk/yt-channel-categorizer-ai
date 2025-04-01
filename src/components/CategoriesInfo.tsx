
import { CATEGORIES } from "@/utils/constants";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const CategoriesInfo = () => {
  return (
    <div className="border rounded-md p-4">
      <h3 className="font-semibold mb-3">Available Categories</h3>
      <Accordion type="single" collapsible className="w-full">
        {CATEGORIES.map((category, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-tag">{category.name}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CategoriesInfo;
