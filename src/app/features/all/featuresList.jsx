'use client'

const FeaturesList = () => {
    const features = [
        {
            title: "Home Page",
            items: [
                "Team Invitations: Invite multiple team members simultaneously, tracking both invite and joined statuses, along with their assigned roles."
            ]
        },
        {
            title: "Project Management",
            items: [
                "Create, view, update, and delete projects easily.",
                "Bulk Project Actions: Delete multiple projects with a single click.",
                "Multiple View Modes: Switch between Table, Split, and Card views for a tailored project management experience.",
                "Module Customization: Enable or disable modules (e.g., Backlog, Sprint, Risk) as per project needs with a single click."
            ]
        },
        {
            title: "Inbox",
            items: [
                "Unified Task View: Access all assigned work items, issues, tasks, and project to-dos in one consolidated list."
            ]
        },
        {
            title: "Dashboard",
            items: [
                "Work Item Insights: Visualize work item statuses via donut, bar charts categorized by status, assignee, priority, progress, risks, and more.",
                "Task Reminders: Monitor tasks by overdue, due tomorrow, next week, or next month.",
                "Team & Stakeholder Overview: Track total work items, team members, and stakeholders.",
                "Top 5 Modules: Drag and arrange your top 5 work items, issues, dependencies, risks, and assumptions."
            ]
        },
        {
            title: "Backlog",
            items: [
                "Quick Sprint Creation: Generate sprints with a single click.",
                "Advanced Filters: Filter work items by assignee, priority, due date, and type.",
                "Customizable Work Item Details: Add work item details like start/due dates, risk, dependencies, assumptions, and labels.",
                "Multiple Views: Switch between 8 views—Product Backlog, Table, Split, Card, Chart, Gantt, Calendar, Kanban.",
                "Visual Indicators: Color-code work items based on status and priority, with overdue items marked in red."
            ]
        },
        {
            title: "Roadmap",
            items: [
                "Progress Tracking: Add progress via slider and track visually through different color indications.",
                "Gantt View: View roadmaps in Gantt format and drag items to adjust dates.",
                "Snapshot & Refresh: Quickly refresh and capture snapshots of your roadmap.",
                "Multiple Views: Choose from Table, Split, Gantt, Calendar, Card, and Chart views for the roadmap.",
                "Quarter/Day Views: Set roadmap visibility to Quarter Day, Half Day, Today, Week, or Month."
            ]
        },
        {
            title: "Timeline",
            items: [
                "Date-based View: Track work items based on start and due dates in a Gantt chart.",
                "Progress Updates: Easily update progress using a slider.",
                "Drag & Drop: Adjust work item timelines through drag-and-drop functionality."
            ]
        },
        {
            title: "Sprint Management",
            items: [
                "Easily manage sprints with creation, view, update, and delete features.",
                "Multiple View Options: Switch between Table, Split, Calendar, Card, and Chart views.",
                "Work Item Overview: View all work items under a sprint in an expandable Table view."
            ]
        },
        {
            title: "Board",
            items: [
                "One-Click Work Item Management: Manage work items across different statuses with a single click.",
                "Quick Updates: Modify type, priority, assignee, due date, story points, and size instantly.",
                "Workflow Customization: Fully customizable workflow design.",
                "Snapshot & Refresh: Take snapshots and quick-refresh the board as needed.",
                "Multiple Views: Select from Table, Chart, Split, Kanban, Gantt, Calendar, and Card views.",
                "Advanced Filters: Filter by assignee, priority, status, due date, and stage."
            ]
        },
        {
            title: "Filters",
            items: [
                "Saved Filters: View and manage saved filters for work items, releases, risks, assumptions, issues, dependencies, stakeholders, retrospectives, bookmarks, and timers.",
                "Advanced Table View: View items across different modules in a comprehensive table format.",
                "Filter Management: Edit or delete saved filters easily."
            ]
        },
        {
            title: "Document Management",
            items: [
                "Centralized Documents: Store and manage all project-related documents in one place.",
                "One-Click Downloads: Download documents instantly.",
                "Multiple Views: View documents in Table, Split, and Card formats."
            ]
        },
        {
            title: "Reminders",
            items: [
                "Due Date Alerts: View work items sorted by overdue, due tomorrow, due next week, and due next month categories."
            ]
        },
        {
            title: "Team Management",
            items: [
                "Add, update, view, delete, invite, and manage team members efficiently.",
                "Role Assignment: Assign roles like member or administrator.",
                "Multiple Views: View team members in Table, Split, and Card layouts."
            ]
        },
        {
            title: "Stakeholder Management",
            items: [
                "Feature to view, add, update and delete.",
                "Manage all stakeholders in a single location.",
                "Multiple Views: Switch between Table, Split, and Card views for stakeholders."
            ]
        },
        {
            title: "Holiday Management",
            items: [
                "Holiday Calendar: View holidays in a calendar format.",
                "Team Communication: Team members can add holidays to notify others.",
                "View Modes: See holidays by Month, Week, Day, and Agenda."
            ]
        },
        {
            title: "Org Chart",
            items: [
                "Organizational Structure: Visualize your team hierarchy and roles through an interactive org chart."
            ]
        },
        {
            title: "Risk Log",
            items: [
                "Full risk log management with Create, View, Update, and Delete functionality.",
                "Quick refresh feature for real-time updates.",
                "Capture snapshots of risk logs for easy reference.",
                "Supports five dynamic views: Table, Split, Kanban, Card, and Chart.",
                "Assign work items to the appropriate risk list.",
                "Kanban view offers workflow tracking for each risk log, with stages: To Do, In Progress, and Done."
            ]
        },
        {
            title: "Assumption Log",
            items: [
                "Complete assumption log management with view, update, delete and add capabilities.",
                "Instant refresh option for up-to-date data.",
                "Snapshots for quick capture of assumption logs.",
                "Available in five flexible views: Table, Split, Kanban, Card, and Chart.",
                "Assign work items to specific assumption lists for streamlined organization.",
                "Kanban view helps manage assumption logs with clear stages: To Do, In Progress, and Done."
            ]
        },
        {
            title: "Issue Log",
            items: [
                "Comprehensive issue log management with view, update, delete and add support.",
                "Fast refresh option for immediate data updates.",
                "Snapshots allow for quick captures of issue logs.",
                "Choose between five different views: Table, Split, Kanban, Card, and Chart.",
                "Assign work items to appropriate issue lists for structured tracking.",
                "Track issue logs in Kanban view through distinct workflow stages: To Do, In Progress, and Done."
            ]
        },
        {
            title: "Dependency Log",
            items: [
                "Manage dependencies with full add, update, view and delete functionality.",
                "Instant refresh feature for live updates.",
                "Capture snapshots of dependency logs for quick reviews.",
                "View data in five versatile layouts: Table, Split, Kanban, Card, and Chart.",
                "Assign work items to related dependency lists for organized project tracking."
            ]
        },
        {
            title: "Pages",
            items: [
                "WYSIWYG Editor: Create and edit pages with an intuitive What-You-See-Is-What-You-Get (WYSIWYG) editor for seamless content formatting.",
                "Document Import: Easily copy and paste Word documents, including images, directly into the editor for faster content creation.",
                "Rich Text Formatting: Access a wide range of formatting options, such as changing font styles, adjusting headers, applying background colors, and adding bold, italics, underlines, and more.",
                "Snapshot Feature: Quickly capture snapshots of the page for instant sharing or record-keeping.",
                "Export Options: Export pages in multiple formats, including PDF and DOC, for easy sharing and collaboration.",
            ]
        },
        {
            title: "Retrospectives",
            items: [
                "Categorized retrospectives: 'What went well,' 'What didn’t go well,' and 'Ideas for improvement.'",
                "Track improvements with a Kanban-style status update feature.",
                "Choose from five views: Table, Split, Kanban, Card, and Charts.",
                "Capture and share snapshots of retrospectives with ease.",
                "Refresh retrospectives instantly with the quick refresh feature."
            ]
        },
        {
            title: "Import",
            items: [
                "Import work items, risks, assumptions, issues, and dependencies using CSV format.",
                "Pre-configured sample CSV formats provided for each module.",
                "Preview data before finalizing the import process.",
                "Monitor progress in real-time while importing."
            ]
        },
        {
            title: "Timer",
            items: [
                "Access the Timer in three views: Table, Split, and Card.",
                "Log time in the background while performing other tasks.",
                "Intuitive and modern user interface for seamless time management."
            ]
        },
        {
            title: "Project To-Do",
            items: [
                "Easily track and update project tasks for quick status monitoring.",
                "Customize your To-Do workflow by adding, editing, or removing stages.",
                "Filter tasks by member, priority, due date, and stage.",
                "Capture task snapshots in multiple views like Kanban, Card, and Charts.",
                "Instantly refresh your task list with the quick refresh feature.",
                "Access six different views, including Table and Split.",
                "Add tasks to the To-Do list with just one click.",
                "Update task priority, status, and members instantly.",
                "Color-coded indicators for quick recognition of task priority and status."
            ]
        },
        {
            title: "Bookmarks",
            items: [
                "Consolidate all important project-related links in one place with the bookmark feature.",
                "Add, update, delete, and view bookmarks effortlessly.",
                "Access bookmarks in three views: Table, Split, and Card."
            ]
        },
        {
            title: "Whiteboard",
            items: [
                "Easily brainstorm and collaborate by drawing your ideas on a shared whiteboard.",
                "Use a variety of shapes to quickly visualize and make decisions.",
                "Copy-paste screens and images for enhanced collaboration.",
                "Utilize laser pointers, save and export options to share your whiteboard content.",
                "Add text in various colors and sizes for greater flexibility.",
                "Toggle between Light and Dark modes for a customized working experience."
            ]
        },
        {
            title: "Split View",
            items: [
                "View all records in a Table alongside detailed information in Split View.",
                "Access detailed records with a single click.",
                "Effortlessly edit or delete records directly from the view."
            ]
        },
        {
            title: "Chart View",
            items: [
                "Visualize data with three chart types: Donut, Horizontal Bar, and Vertical Bar.",
                "Generate charts based on a wide range of field types within the module.",
                "Use color-coded charts for quick and easy reference."
            ]
        },
        {
            title: "Calendar View",
            items: [
                "Track tasks visually with a calendar-based overview.",
                "Manage task timelines with ease.",
                "Add new tasks with a single click.",
                "Edit tasks by double-clicking on calendar entries.",
                "Switch between Week, Month, Day, and Agenda views for a flexible task overview."
            ]
        },
        {
            title: "Table View",
            items: [
                "Advanced column-based filtering for refined data searches.",
                "Save filters for quick reusability.",
                "Adjust the table density with options for compact, standard, and comfortable views.",
                "Export data as CSV or print records directly.",
                "Toggle columns on or off for customized views.",
                "Sort data for easier management.",
                "Pin columns to the left or right for better data accessibility.",
                "Drag-and-drop rows for easy reordering."
            ]
        },
        {
            "title": "Video Conferencing",
            "items": [
                "Seamless, real-time video communication with high-quality audio and video.",
                "Device flexibility for switching between cameras and microphones easily.",
                "Join meetings via URL for quick access.",
            ]
        },
        {
            "title": "Text Chat",
            "items": [
                "Real-time messaging during or outside of video calls.",
            ]
        },
        {
            title: "Admin Settings",
            items: [
                "Email Management: View a list of all sent emails from the platform.",
                "Field Customization: Add, edit, or delete fields for modules like Project, Work Item, Sprint, Release, Roadmap, Team, Stakeholder, and many more.",
                "Profile Management: Update profile settings like time format, time zone, company size, and domain expertise.",
                "Account Management: Change password and delete account functionality for added control."
            ]
        }
    ];

    return (
        <div style={{ padding: '20px' }} className="mt-12 mb-7">
            <h2>
                SCALE Features
            </h2>
            {features.map((section, index) => (
                <div key={index} className="mb-10 border shadow-md rounded-sm p-4">
                    <div className="mb-4 mt-1">
                        <div className="text-lg">{section.title}</div>
                    </div>
                    <div>
                        <ul className="ml-10">
                            {section.items.map((item, idx) => (
                                <li key={idx} class="text-gray-800 text-lg mb-2 pl-4 list-disc">
                                    <p>{item}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))
            }
        </div >
    );
};

export default FeaturesList;
