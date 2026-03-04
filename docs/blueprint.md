# **App Name**: GarageFlow Desk

## Core Features:

- Job Sheet & Item Management: Create and manage job sheets with auto-generated job numbers. Record vehicle details, complaints, mechanic notes, and job status. Add parts and labor items with descriptions, quantities, unit prices, and automatic subtotal calculations. Allows editing and tracking of job progress.
- Proforma Invoice Workflow: Generate editable proforma invoices directly from job sheets. Facilitate item additions, edits to quantities and prices, item removal, discount application, and VAT toggling with real-time total updates. Includes a quick-entry field for line items and finalization to lock the proforma with a full data snapshot.
- Final Invoice & Payment Processing: Convert finalized proforma invoices into official final invoices with sequential numbering. Generate printable invoices and PDF downloads. Record full or partial payments using various methods (Cash, M-Pesa, Bank Transfer, Other) with amount, method, reference, and date paid, showing remaining balance.
- Customer & Vehicle Registry: Manage a comprehensive database of customer details (name, phone, address) and linked vehicle information (plate number, make, model). This data seamlessly integrates into job sheets and invoices.
- Dashboard & Reporting: Provide a central dashboard displaying key operational metrics like open jobs, completed jobs, pending payments, today's sales, and monthly sales. Generate essential reports such as Daily Sales, Monthly Sales, Outstanding Balances, and Completed Jobs.
- Local Data Persistence (SQLite): Store all application data in a local SQLite database, ensuring full offline operation without reliance on internet connectivity or cloud services. All system configuration, generated documents, and database files are managed on the local file system at C:\ProgramData\GarageSystem\.
- Backup Manager (Manual & Automated): Enable manual backups of the entire system (database and files) into a ZIP archive with a single click. Configure automatic weekly backups through a Windows Task Scheduler script, managing backup filename formats and retaining only the last 12 backups.

## Style Guidelines:

- Background color: White (#FFFFFF), ensuring a clean and modern workspace.
- Primary action color: A rich red (#C10D12), used for main buttons and interactive elements.
- Accent and alert color: A vibrant red (#FC3A35), designated for alerts, highlights, and critical notifications.
- Subtle UI color: A neutral grey (#B0B2B5), applied to borders, separators, and subtle background elements.
- Text color: Black (#000000) for all primary text content to ensure maximum readability against the light background.
- All text uses 'Inter' (sans-serif), chosen for its modern, clean appearance and high legibility across various screen sizes and text densities, suitable for both headlines and body content in a data-rich environment.
- Use a consistent set of minimalist, flat-style icons that align with the clean modern dashboard aesthetic, ensuring clarity and ease of recognition for users.
- The application features a sidebar navigation layout providing quick access to all main sections. The Dashboard uses a structured grid layout to display key performance indicators and recent activities at a glance.
- Incorporate subtle transition animations for page changes and status updates, enhancing the overall user experience without being distracting or affecting performance in a desktop environment.