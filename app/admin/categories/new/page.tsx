import { CategoryForm } from "@/components/admin/CategoryForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
          <CardDescription>
            Fill in the details below to add a new product category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryForm />
        </CardContent>
      </Card>
    </div>
  );
}
