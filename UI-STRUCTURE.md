# UI Structure Documentation

## Overview
The resources folder has been reconfigured for a modern, scalable UI architecture using React components with Tailwind CSS styling.

## New Folder Structure

```
resources/js/
├── Components/
│   ├── index.js              # Main components export
│   ├── UI/                   # Basic UI elements
│   │   ├── Button.jsx        # Button component with variants
│   │   ├── Card.jsx          # Card layout components
│   │   ├── Alert.jsx         # Alert and toast notifications
│   │   └── Loading.jsx       # Loading spinners and overlays
│   ├── Forms/                # Form-related components
│   │   ├── Form.jsx          # Form wrapper and layout
│   │   └── FormInputs.jsx    # Input, TextArea, Select components
│   ├── Tables/               # Table components
│   │   └── Table.jsx         # Full table implementation
│   ├── Modals/               # Modal components
│   │   └── Modal.jsx         # Modal and ConfirmModal
│   └── Charts/               # Chart components (to be added)
├── Utils/                    # Utility functions
│   └── formatters.js         # Currency, date, number formatters
├── Hooks/                    # Custom React hooks
│   └── index.js              # useForm, useApi, useDebounce hooks
├── Constants/                # Application constants
│   └── index.js              # Status constants, API endpoints
├── Pages/                    # Page components (existing)
└── Layouts/                  # Layout components (existing)
```

## Key Features

### 1. UI Components
- **Reusable Components**: Button, Card, Alert, Loading, etc.
- **Consistent Styling**: Tailwind CSS with predefined variants
- **Accessibility**: ARIA labels and keyboard navigation
- **TypeScript-ready**: Proper prop definitions

### 2. Form System
- **Form Wrapper**: Handles submission and validation
- **Input Components**: Unified styling and error handling
- **Custom Hook**: `useForm` for state management

### 3. Table System
- **Responsive Tables**: Mobile-friendly design
- **Sortable Headers**: Built-in sorting functionality
- **Action Buttons**: Dedicated action cell component

### 4. Modal System
- **Backdrop Click**: Close on backdrop click
- **Size Variants**: sm, md, lg, xl, full
- **Confirm Modal**: Pre-built confirmation dialogs

### 5. Utility Functions
- **Currency Formatting**: BDT currency support
- **Date Formatting**: Multiple format options
- **Phone Formatting**: Bangladesh phone number formatting
- **Text Utilities**: Truncate, capitalize, slug generation

### 6. Custom Hooks
- **useForm**: Form state and validation management
- **useApi**: API call management with loading states
- **useDebounce**: Debounced value updates for search
- **useLocalStorage**: Persistent local storage state

## Usage Examples

### Basic Button Usage
```jsx
import { Button } from '@components';

<Button variant="primary" size="lg" onClick={handleClick}>
    Click Me
</Button>
```

### Form Usage
```jsx
import { Form, FormRow, Input, SubmitButton } from '@components';
import { useForm } from '@hooks';

const MyForm = () => {
    const { values, errors, setValue, validate } = useForm({
        name: '',
        email: ''
    });

    return (
        <Form onSubmit={handleSubmit}>
            <FormRow>
                <Input 
                    label="Name"
                    value={values.name}
                    onChange={(e) => setValue('name', e.target.value)}
                    error={errors.name}
                />
                <Input 
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={(e) => setValue('email', e.target.value)}
                    error={errors.email}
                />
            </FormRow>
            <SubmitButton>Save</SubmitButton>
        </Form>
    );
};
```

### Table Usage
```jsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@components';

<Table>
    <TableHeader>
        <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        {users.map(user => (
            <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    <Button size="sm">Edit</Button>
                </TableCell>
            </TableRow>
        ))}
    </TableBody>
</Table>
```

### Card Usage
```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@components';

<Card>
    <CardHeader>
        <CardTitle>Dashboard Stats</CardTitle>
    </CardHeader>
    <CardContent>
        <p>Content goes here</p>
    </CardContent>
</Card>
```

## Import Aliases
The following aliases are configured in `vite.config.js`:
- `@components` → `/resources/js/Components`
- `@pages` → `/resources/js/Pages`
- `@layouts` → `/resources/js/Layouts`
- `@utils` → `/resources/js/Utils`
- `@hooks` → `/resources/js/Hooks`
- `@constants` → `/resources/js/Constants`

## Styling Conventions

### Colors
- **Primary**: Blue (600-700)
- **Success**: Green (600-700)
- **Warning**: Yellow (600-700)
- **Danger**: Red (600-700)
- **Secondary**: Gray (200-300)

### Sizes
- **sm**: Small components
- **md**: Medium (default)
- **lg**: Large
- **xl**: Extra large

### Spacing
- **Consistent margins**: 4, 6, 8 for component spacing
- **Padding**: 3, 4, 6 for internal spacing
- **Grid gaps**: 4, 6, 8 for layout gaps

## Migration Guide

### Existing Components
1. Replace custom button elements with `<Button>`
2. Wrap content in `<Card>` components for consistent styling
3. Use form components for consistent input styling
4. Replace table HTML with table components

### New Features
1. Use `useForm` hook for form state management
2. Implement `formatCurrency` and `formatDate` utilities
3. Add loading states with `LoadingSpinner`
4. Use modals for confirmations and forms

## Future Enhancements
- [ ] Chart components (Chart.js integration)
- [ ] Advanced data tables with filtering/pagination
- [ ] File upload components
- [ ] Rich text editor component
- [ ] Date picker components
- [ ] Multi-select components
