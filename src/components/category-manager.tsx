"use client";

import { CategoryForm } from "todo/components/category-form";
import { CategoryItem } from "todo/components/category-item";

interface Category {
  id: string;
  name: string;
  color: string | null;
}

export function CategoryManager() {
  // TODO: Fetch categories using api.category.getAll.useQuery()
  const categories: Category[] = [];
  const isLoading = false;

  return (
    <div className="space-y-8">
      <section aria-labelledby="create-category-heading">
        <h2
          id="create-category-heading"
          className="mb-4 text-lg font-semibold text-foreground"
        >
          Create Category
        </h2>
        <CategoryForm />
      </section>

      <section aria-labelledby="categories-list-heading">
        <h2
          id="categories-list-heading"
          className="mb-4 text-lg font-semibold text-foreground"
        >
          Your Categories
        </h2>

        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <p>Loading categories...</p>
          </div>
        ) : categories && categories.length > 0 ? (
          <ul className="space-y-3" aria-label="Categories list">
            {categories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <p>No categories yet</p>
            <p className="mt-1 text-xs">
              Create your first category to organize your tasks
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
