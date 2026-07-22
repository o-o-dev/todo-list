# Development Prompts

---

## Prompt 1: Authentication Pages Layout

**Files:** `src/app/(auth)/layout.tsx`

> Create a layout component for the authentication pages (login and signup). The layout should have a centered card design with a decorative background pattern using subtle grid lines and a gradient blur effect. Include a header with the app branding "TODO LIST" and a decorative footer element. Use Tailwind CSS for styling with dark mode support. This will be the base styling for all pages.

---

## Prompt 2: Login Page UI

**Files:** `src/app/(auth)/login/page.tsx`

> Build a login page UI using shadcn/ui Card, Button, and Input components to match our component library:
>
> - Email and password input fields
> - Error message display area below inputs
> - Submit button with loading state that shows "Signing in..."
> - Link to signup page for users without an account

---

## Prompt 3: Signup Page UI

**Files:** `src/app/(auth)/signup/page.tsx`

> Create a signup page UI matching the login page styling:
>
> - Username, email, password, and confirm password input fields
> - Field-specific error message display
> - Success message state with green styling
> - Submit button with loading state
> - Link to login page for existing users

---

## Prompt 4: Main Dashboard Page Layout

**Files:** `src/app/page.tsx`

> Build the main dashboard page layout with two states. Keep the same decorative background pattern as auth pages for consistency:
>
> - Logged in: Welcome card with username, header with "Categories" link and sign out button, card for todo list content
> - Not logged in: Welcome card with sign in/create account buttons
> - Use shadcn/ui Card components to match existing pages
> - Add subtle fade-in animations using Tailwind animate-in classes

---

## Prompt 5: Categories Page Layout

**Files:** `src/app/categories/page.tsx`

> Create a categories page layout with the same styling and background as the dashboard:
>
> - Back link to home page
> - Card wrapper for category management content

---

## Prompt 6: Todo Form UI

**Files:** `src/components/todo-form.tsx`

> Create a todo form UI using shadcn/ui Button and Input components:
>
> - Text input for task content with placeholder "Add a new task..."
> - Category dropdown selector below the input
> - Submit button that shows "Adding..." while disabled
> - Maximum input length of 256 characters
> - Horizontal layout for input and button

---

## Prompt 7: Todo List UI with Batch Mode

**Files:** `src/components/todo-list.tsx`

> Build a todo list UI component with both individual and batch editing modes. Use shadcn/ui components and match the app's styling with rounded borders, subtle backgrounds, and dark mode support:
>
> **List Display:**
>
> - Each todo shows: checkbox, content text, category badge with color, creation date
> - Edit and delete icon buttons on the right
> - Completed items show strikethrough text
>
> **Inline Editing:**
>
> - Input field replaces content text
> - Save (checkmark) and cancel (X) icon buttons
> - Enter to save, Escape to cancel
>
> **Batch Mode UI:**
>
> - Toggle button to enter/exit batch mode
> - "Batch Mode" badge when active
> - Amber background for items with pending edits
> - Red background for items marked for deletion
> - "Edited" badge for pending updates
> - "Undo" button for pending deletes
> - Summary bar showing pending changes count
> - "Discard" and "Submit Changes" buttons
> - Warning dialog when exiting with unsaved changes (use shadcn/ui AlertDialog)

---

## Prompt 8: Category Form UI

**Files:** `src/components/category-form.tsx`

> Create a category form UI using shadcn/ui Button and Input components to match existing forms:
>
> - Name input with label "Category Name" and helper text
> - Color picker component below the input
> - Full-width submit button showing "Creating..." when disabled
> - Placeholder text "e.g. Work, Personal, Shopping"
> - Max length of 50 characters

---

## Prompt 9: Category Item UI

**Files:** `src/components/category-item.tsx`

> Build a category list item UI matching the todo list item styling with rounded borders and subtle backgrounds:
>
> **Display Mode:**
>
> - Color dot, category name, edit icon button, delete icon button
> - Horizontal layout with items centered
>
> **Edit Mode:**
>
> - Labeled input for name
> - Color picker for color selection
> - Save and Cancel buttons using shadcn/ui Button
> - Keyboard support: Enter to save, Escape to cancel
>
> Use SVG icons for edit (pencil) and delete (X) buttons.

---

## Prompt 10: Category Select Dropdown

**Files:** `src/components/category-select.tsx`

> Create a styled category dropdown matching the app's rounded design:
>
> - Native select element with custom appearance
> - Color indicator dot that shows the selected category's color
> - "No category" as the default option
> - Custom dropdown arrow using CSS background image
> - Rounded pill-style design
> - Focus ring styling consistent with other inputs

---

## Prompt 11: Category Manager Layout

**Files:** `src/components/category-manager.tsx`

> Create a category manager layout using the same spacing and typography as other sections:
>
> - "Create Category" section with CategoryForm
> - "Your Categories" section with list of CategoryItem components
> - Loading state text
> - Empty state message when no categories exist
> - Proper heading hierarchy
