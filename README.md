<br /><br />

<h3 align="center"><b>Scale</b></h3>
<p align="center"><b>Open-source Work, Project and Task management platform designed for simplicity and efficiency</b></p>


<p align="center">
    <a href="https://scale.ac/"><b>Website</b></a> •
    <a href="https://www.linkedin.com/company/104654604/"><b>LinkedIn</b></a> •
    <a href="https://x.com/Scaleapp7"><b>Twitter</b></a> •
    <a href="https://www.youtube.com/@scale-ac"><b>YouTube</b></a>
</p>



[Scale](https://scale.ac/), an  open-source Work, Project and Task management platform with more than 30+ features.



## ⚡ Installation

The fastest and easiest and way to get started with Scale is by creating a [Scale](https://scale.ac) account.

If you would like to self-host Scale, then fork this repo and it is a just a Next JS app with MongoDB.

## 🚀 Features

- **Project Management**:  
  <ul style="list-style: none;">
    <li>Easily create, view, update, and remove projects.</li>
    <li>Streamlined Project Actions: Remove multiple projects in one step.</li>
    <li>Flexible View Options: Toggle between Table, Split, and Card layouts for a customized project management experience.</li>
    <li>Module Settings: Enable or disable features like Backlog, Sprint, and Risk with a single click, tailored to project needs.</li>
  </ul>

- **Sprint Management**:  
  <ul style="list-style: none;">
    <li>Seamlessly manage sprints with the ability to create, view, update, and delete entries.</li>
    <li>Multiple Display Options: Access sprints in Table, Split, Calendar, Card, and Chart formats.</li>
    <li>Comprehensive Item Overview: View all tasks under a sprint with an expandable Table layout.</li>
  </ul>

- **Board**:  
  <ul style="list-style: none;">
    <li>Effortless Work Item Management: Update work item statuses with a single click.</li>
    <li>Instant Adjustments: Modify item details such as type, priority, assignee, due date, story points, and size instantly.</li>
    <li>Configurable Workflow: Fully customizable workflow to suit team needs.</li>
    <li>Snapshot & Refresh: Capture snapshots and refresh the board instantly for up-to-date information.</li>
    <li>Diverse View Options: Choose from Table, Chart, Split, Kanban, Gantt, Calendar, and Card views.</li>
    <li>Advanced Filtering: Sort by assignee, priority, status, due date, and stage.</li>
  </ul>

- **Filters**:  
  <ul style="list-style: none;">
    <li>Saved Filters: Access and manage saved filters across work items, releases, risks, assumptions, issues, dependencies, stakeholders, retrospectives, bookmarks, and timers.</li>
    <li>Advanced Table Layout: View items from multiple modules in a single, detailed table.</li>
    <li>Filter Management: Quickly edit or delete saved filters as needed.</li>
  </ul>

- **Team Management**:  
  <ul style="list-style: none;">
    <li>Efficiently manage team members with options to add, update, view, delete, and invite them.</li>
    <li>Role Assignment: Designate members or administrators to team roles.</li>
    <li>Various View Modes: View team members in Table, Split, and Card layouts.</li>
  </ul>

- **Pages**:  
  <ul style="list-style: none;">
    <li>WYSIWYG Editor: Utilize an intuitive editor to create and format content with ease.</li>
    <li>Document Import: Quickly import Word documents, including images, directly into the editor for efficient content creation.</li>
    <li>Rich Text Features: Access extensive formatting options such as font styling, headers, background colors, bold, italics, underline, and more.</li>
    <li>Snapshot Feature: Capture page snapshots for instant sharing or record-keeping.</li>
    <li>Export Capability: Export pages in various formats, including PDF and DOC, for easy sharing and collaboration.</li>
  </ul>

- **Whiteboard**:  
  <ul style="list-style: none;">
    <li>Collaborate and brainstorm effectively with a shared whiteboard.</li>
    <li>Utilize shapes for quick visualization and decision-making.</li>
    <li>Enhance collaboration with copy-paste options for screens and images.</li>
    <li>Leverage laser pointers, and save and export functions for sharing content.</li>
    <li>Flexible Text Options: Add text in multiple colors and sizes to fit any purpose.</li>
  </ul>


## 🛠️ Quick start for contributors

> Development system must have docker engine installed and running.

Setting up local environment is extremely easy and straight forward. Follow the below step and you will be ready to contribute - 

1. Clone the code locally using:
   ```
   git clone https://github.com/pankajindevops/scale
   ```
2. Switch to the code folder:
   ```
   cd scale
   ```
3. Create your feature or fix branch you plan to work on using:
   ```
   git checkout -b <feature-branch-name>
   ```
4. Open terminal and run:
   ```
   ./npm install
   ```
    ```
   ./npm run dev
   ```
5. Open the code on VSCode or similar equivalent IDE.
6. Review the `.env` files available in various folders.
   Visit [Environment Setup](./ENV_SETUP.md) to know about various environment variables used in system.
7. Run the docker command to initiate services:
   ```
   docker compose -f docker-compose-local.yml up -d
   ```

You are ready to make changes to the code. Do not forget to refresh the browser (in case it does not auto-reload).

Thats it!



## 📸 Screenshots

<p>
    <a href="https://scale.ac" target="_blank">
      <img
        src="https://scale.ac/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fboard.6ecb94ff.PNG&w=1920&q=75"
        width="100%"
      />
    </a>
  </p>
<p>
    <a href="https://scale.ac" target="_blank">
      <img
        src="https://scale.ac/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffilters.d542c77a.PNG&w=1920&q=75"
        width="100%"
      />
    </a>
  </p>
  <p>
    <a href="https://scale.ac" target="_blank">
      <img
        src="https://scale.ac/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fteam.79f2ee7e.PNG&w=1920&q=75"
        width="100%"
      />
    </a>
  </p>
  <p>
    <a href="https://scale.ac" target="_blank">
      <img
        src="https://scale.ac/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpage.444ae052.PNG&w=1920&q=75"
        width="100%"
      />
    </a>
  </p>
   <p>
    <a href="https://scale.ac" target="_blank">
      <img
        src="https://scale.ac/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftimer.b5afa152.PNG&w=1920&q=75"
        width="100%"
      />
    </a>
  </p>
</p>
   <p>
    <a href="https://scale.ac" target="_blank">
      <img
        src="https://scale.ac/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwhiteboard.b7b684ce.PNG&w=1920&q=75"
        width="100%"
      />
    </a>
  </p>
</p>



## ❤️ Contribute

We love your contributions.





