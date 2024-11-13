import { create } from 'zustand'
import { persist, createJSONStorage }
    from 'zustand/middleware'

const useAppStore = create(
    persist(
        (set, get) => ({
            dopen: true,
            leadFormOpen: false,
            leadData: [],
            accountData: [],
            contactData: [],
            notesData: [],
            formData: null,
            sessionData: null,
            onboardData: null,
            isClone: false,
            csvImportFormOpen: false,
            rowSelection: [],
            iform: null,
            userId: '',
            leadmaster: null,
            isMailDrawer: false,
            isEventDrawer: false,
            meetingData: '',
            mailSetupDrawer: false,
            imapHost: '',
            imapPort: '',
            smtpHost: '',
            smtpPort: '',
            mailUser: '',
            mailPassword: '',
            mailEmail: '',
            mailSecurityMode: '',
            userEmail: '',
            selectedEmailList: [],
            isSmsDrawer: false,
            selectedSmsList: [],
            isTaskDrawer: false,
            taskData: '',
            taskRowSelected: null,
            productsData: [],
            quotesData: [],
            opportunitymaster: null,
            contactmaster: null,
            notemaster: null,
            productmaster: null,
            quotemaster: null,
            isCommonDrawer: false,
            rowsInReport: [],
            rootuser: null,
            organizationName: null,
            teamData: [],
            userRole: [],
            calendarEventDialog: false,
            selectedImportData: '',
            googleAccessToken: '',
            googleEmailRecords: [],
            googleEmailProfile: '',
            outlookAccessToken: '',
            outllokEmailRecords: [],
            sentEmailRecords: [],
            workflowRecords: [],
            currentWorkflowRecords: [],
            isProjectDrawer: false,
            feldList: null,
            projectmaster: null,
            backlogmaster: null,
            backlogList: [],
            isSprintDrawer: false,
            isWorkitemDrawer: false,
            sprintmaster: null,
            sprintList: [],
            projectList: [],
            isBacklogUpdated: false,
            teamList: [],
            isTeamDrawer: false,
            teammaster: null,
            assumptionmaster: null,
            isAssumptionDrawer: false,
            assumptionList: [],
            teamchartermaster: null,
            isTeamcharterDrawer: false,
            teamcharterList: [],
            riskList: [],
            isRiskDrawer: null,
            riskmaster: null,
            issuemaster: null,
            isIssueDrawer: null,
            issueList: [],
            dependencyList: [],
            isDependencyDrawer: null,
            dependencymaster: null,
            memberList: [],
            isMemberDrawer: false,
            membermaster: null,
            stakeholderList: [],
            isStakeholderDrawer: false,
            stakeholdermaster: null,
            documentmaster: null,
            isDocumentDrawer: false,
            documentList: [],
            viewMode: 'Table',
            usersList: [],
            usermaster: [],
            backlogSteps: null,
            pageList: null,
            expandedItems: [],
            pagemaster: null,
            pageList: [],
            controlledFilter: {},
            savedFilters: {},
            filterList: {},
            isProfileDrawer: false,
            fromPage: '',
            isPasswordDrawer: false,
            holidaymaster: null,
            isHolidayDrawer: false,
            holidayList: [],
            timesheetmaster: null,
            isTimesheetDrawer: false,
            timesheetList: [],
            retrospectivemaster: null,
            isRetrospectiveDrawer: false,
            retrospectiveList: [],
            importFrom: '',
            importFileName: null,
            isClone: false,
            dashboardState: { "tasks": { "1": { "id": "Backlog", "title": "Backlog" }, "2": { "id": "Risk", "title": "Risk" }, "3": { "id": "Assumption", "title": "Assumption" }, "4": { "id": "Dependency", "title": "Dependency" }, "5": { "id": "Issue", "title": "Issue" } }, "columns": { "First": { "id": "First", "title": "First", "taskIds": [1, 2, 3] }, "Second": { "id": "Second", "title": "Second", "taskIds": [4, 5] } }, "columnOrder": ["First", "Second"] },
            attachmentList: [],
            isDashboardDrawer: false,
            isTimeFormatMessage: false,
            isWorkflowDrawer: false,
            selectedMenu: '',
            isTodoDrawer: false,
            todoList: [],
            isKanbanRefresh: false,
            isBookmarkDrawer: false,
            bookmarkList: [],
            bookmarkmaster: null,
            todomaster: null,
            isTimer: false,
            isTimerDrawer: false,
            timerList: [],
            timermaster: null,
            releaseList: [],
            isReleaseDrawer: null,
            releasemaster: null,
            totalTime: 0,
            currentProject: {},
            holidayEventDialog: {},
            timerRunning: false,
            intialBacklogList: [],
            savedLabels: {},
            labelList: {},
            intialTodoList: [],
            isCommentDrawer: false,
            isReminderDrawer: false,
            isRoadmapDrawer: false,
            roadmapList: [],
            roadmapmaster: null,
            mediaDevice: null,
            chatData: [],
            chatEmail: null,
            storedChatData: [],
            updateStoredChatData: (storedChatData) =>
                set({ storedChatData: storedChatData }),
            updateChatEmail: (chatEmail) =>
                set({ chatEmail: chatEmail }),
            updateChatData: (chatData) =>
                set({ chatData: chatData }),
            updateMediaDevice: (mediaDevice) =>
                set({ mediaDevice: mediaDevice }),
            updateRoadmapMaster: (roadmapmaster) =>
                set({ roadmapmaster: roadmapmaster }),
            updateRoadmapList: (roadmapList) =>
                set({ roadmapList: roadmapList }),
            updateIsRoadmapDrawer: (isRoadmapDrawer) =>
                set({ isRoadmapDrawer: isRoadmapDrawer }),
            updateIsReminderDrawer: (isReminderDrawer) =>
                set({ isReminderDrawer: isReminderDrawer }),
            updateIsCommentDrawer: (isCommentDrawer) =>
                set({ isCommentDrawer: isCommentDrawer }),
            updateIntialTodoList: (intialTodoList) =>
                set({ intialTodoList: intialTodoList }),
            updateLabelList: (labelList) =>
                set({ labelList: labelList }),
            updateSavedLabels: (savedLabels) =>
                set({ savedLabels: savedLabels }),
            updateIntialBacklogList: (intialBacklogList) =>
                set({ intialBacklogList: intialBacklogList }),
            updateTimerRunning: (timerRunning) =>
                set({ timerRunning: timerRunning }),
            updateHolidayEventDialog: (holidayEventDialog) =>
                set({ holidayEventDialog: holidayEventDialog }),
            updateCurrentProject: (currentProject) =>
                set({ currentProject: currentProject }),
            updateTotalTime: (totalTime) =>
                set({ totalTime: totalTime }),
            updateReleaseMaster: (releasemaster) =>
                set({ releasemaster: releasemaster }),
            updateIsReleaseDrawer: (isReleaseDrawer) =>
                set({ isReleaseDrawer: isReleaseDrawer }),
            updateReleaseList: (releaseList) =>
                set({ releaseList: releaseList }),
            updateTimermaster: (timermaster) =>
                set({ timermaster: timermaster }),
            updateTimerList: (timerList) =>
                set({ timerList: timerList }),
            updateIsTimerDrawer: (isTimerDrawer) =>
                set({ isTimerDrawer: isTimerDrawer }),
            updateIsTimer: (isTimer) =>
                set({ isTimer: isTimer }),
            updateBookmarkmaster: (bookmarkmaster) =>
                set({ bookmarkmaster: bookmarkmaster }),
            updateBookmarkList: (bookmarkList) =>
                set({ bookmarkList: bookmarkList }),
            updateIsBookmarkDrawer: (isBookmarkDrawer) =>
                set({ isBookmarkDrawer: isBookmarkDrawer }),
            updatedIsKanbanRefresh: (isKanbanRefresh) =>
                set({ isKanbanRefresh: isKanbanRefresh }),
            updatedTodoList: (todoList) =>
                set({ todoList: todoList }),
            updateTodomaster: (todomaster) =>
                set({ todomaster: todomaster }),
            updateIsTodoDrawer: (isTodoDrawer) =>
                set({ isTodoDrawer: isTodoDrawer }),
            updateSelectedMenu: (selectedMenu) =>
                set({ selectedMenu: selectedMenu }),
            updateIsWorkflowDrawer: (isWorkflowDrawer) =>
                set({ isWorkflowDrawer: isWorkflowDrawer }),
            updateIsTimeFormatMessage: (isTimeFormatMessage) =>
                set({ isTimeFormatMessage: isTimeFormatMessage }),
            updateIsDashboardDrawer: (isDashboardDrawer) =>
                set({ isDashboardDrawer: isDashboardDrawer }),
            updateAttachmentList: (attachmentList) =>
                set({ attachmentList: attachmentList }),
            updateDashboardState: (dashboardState) =>
                set({ dashboardState: dashboardState }),
            updateIsClone: (isClone) =>
                set({ isClone: isClone }),
            updateImportFileName: (importFileName) =>
                set({ importFileName: importFileName }),
            updateImportFrom: (importFrom) =>
                set({ importFrom: importFrom }),
            updateRetrospectiveList: (retrospectiveList) =>
                set({ retrospectiveList: retrospectiveList }),
            updateIsRetrospectiveDrawer: (isRetrospectiveDrawer) =>
                set({ isRetrospectiveDrawer: isRetrospectiveDrawer }),
            updateRetrospectivemaster: (retrospectivemaster) =>
                set({ retrospectivemaster: retrospectivemaster }),
            updateTimesheetList: (timesheetList) =>
                set({ timesheetList: timesheetList }),
            updateIsTimesheetDrawer: (isTimesheetDrawer) =>
                set({ isTimesheetDrawer: isTimesheetDrawer }),
            updateTimesheetmaster: (timesheetmaster) =>
                set({ timesheetmaster: timesheetmaster }),
            updateHolidayList: (holidayList) =>
                set({ holidayList: holidayList }),
            updateIsHolidayDrawer: (isHolidayDrawer) =>
                set({ isHolidayDrawer: isHolidayDrawer }),
            updateHolidaymaster: (holidaymaster) =>
                set({ holidaymaster: holidaymaster }),
            updateIsPasswordDrawer: (isPasswordDrawer) =>
                set({ isPasswordDrawer: isPasswordDrawer }),
            updateFromPage: (fromPage) =>
                set({ fromPage: fromPage }),
            updateIsProfileDrawer: (isProfileDrawer) =>
                set({ isProfileDrawer: isProfileDrawer }),
            updateFilterList: (filterList) =>
                set({ filterList: filterList }),
            updateControlledFilter: (controlledFilter) =>
                set({ controlledFilter: controlledFilter }),
            updateSavedFilters: (savedFilters) =>
                set({ savedFilters: savedFilters }),
            updatePagemaster: (pagemaster) =>
                set({ pagemaster: pagemaster }),
            updatePageList: (pageList) =>
                set({ pageList: pageList }),
            updateExpandedItems: (expandedItems) =>
                set({ expandedItems: expandedItems }),
            updatePageList: (pageList) =>
                set({ pageList: pageList }),
            updateBacklogSteps: (backlogSteps) =>
                set({ backlogSteps: backlogSteps }),
            updateUserMaster: (usermaster) =>
                set({ usermaster: usermaster }),
            updateUsersList: (usersList) =>
                set({ usersList: usersList }),
            updateViewMode: (viewMode) =>
                set({ viewMode: viewMode }),
            updateDocumentList: (documentList) =>
                set({ documentList: documentList }),
            updateIsDocumentDrawer: (isDocumentDrawer) =>
                set({ isDocumentDrawer: isDocumentDrawer }),
            updateDocumentMaster: (documentmaster) =>
                set({ documentmaster: documentmaster }),
            updateIsStakeholderDrawer: (isStakeholderDrawer) =>
                set({ isStakeholderDrawer: isStakeholderDrawer }),
            updateStakeholderMaster: (stakeholdermaster) =>
                set({ stakeholdermaster: stakeholdermaster }),
            updateStakeholderList: (stakeholderList) =>
                set({ stakeholderList: stakeholderList }),
            updateMemberList: (memberList) =>
                set({ memberList: memberList }),
            updateMemberMaster: (membermaster) =>
                set({ membermaster: membermaster }),
            updateIsMemberDrawer: (isMemberDrawer) =>
                set({ isMemberDrawer: isMemberDrawer }),
            updateDependencyMaster: (dependencymaster) =>
                set({ dependencymaster: dependencymaster }),
            updateIsDependencyDrawer: (isDependencyDrawer) =>
                set({ isDependencyDrawer: isDependencyDrawer }),
            updateDependencyList: (dependencyList) =>
                set({ dependencyList: dependencyList }),
            updateIsIssueDrawer: (isIssueDrawer) =>
                set({ isIssueDrawer: isIssueDrawer }),
            updateIssueMaster: (issuemaster) =>
                set({ issuemaster: issuemaster }),
            updateIssueList: (issueList) =>
                set({ issueList: issueList }),
            updateRiskMaster: (riskmaster) =>
                set({ riskmaster: riskmaster }),
            updateIsRiskDrawer: (isRiskDrawer) =>
                set({ isRiskDrawer: isRiskDrawer }),
            updateRiskList: (riskList) =>
                set({ riskList: riskList }),
            updateAssumptionList: (assumptionList) =>
                set({ assumptionList: assumptionList }),
            updateIsAssumptionDrawer: (isAssumptionDrawer) =>
                set({ isAssumptionDrawer: isAssumptionDrawer }),
            updateAssumptionMaster: (assumptionmaster) =>
                set({ assumptionmaster: assumptionmaster }),
            updateTeamcharterList: (teamcharterList) =>
                set({ teamcharterList: teamcharterList }),
            updateIsTeamcharterDrawer: (isTeamcharterDrawer) =>
                set({ isTeamcharterDrawer: isTeamcharterDrawer }),
            updateTeamcharterMaster: (teamchartermaster) =>
                set({ teamchartermaster: teamchartermaster }),
            updateTeamMaster: (teammaster) =>
                set({ teammaster: teammaster }),
            updateIsTeamDrawer: (isTeamDrawer) =>
                set({ isTeamDrawer: isTeamDrawer }),
            updateTeamList: (teamList) =>
                set({ teamList: teamList }),
            updateIsBacklogUpdated: (isBacklogUpdated) =>
                set({ isBacklogUpdated: isBacklogUpdated }),
            updateProjectList: (projectList) =>
                set({ projectList: projectList }),
            updateSprintList: (sprintList) =>
                set({ sprintList: sprintList }),
            updateSprintMaster: (sprintmaster) =>
                set({ sprintmaster: sprintmaster }),
            updateIsWorkitemDrawer: (isWorkitemDrawer) =>
                set({ isWorkitemDrawer: isWorkitemDrawer }),
            updateIsSprintDrawer: (isSprintDrawer) =>
                set({ isSprintDrawer: isSprintDrawer }),
            updateBacklogList: (backlogList) =>
                set({ backlogList: backlogList }),
            updateBacklogMaster: (backlogmaster) =>
                set({ backlogmaster: backlogmaster }),
            updateProjectMaster: (projectmaster) =>
                set({ projectmaster: projectmaster }),
            updateFieldList: (feldList) =>
                set({ feldList: feldList }),
            updateIsProjectDrawer: (isProjectDrawer) =>
                set({ isProjectDrawer: isProjectDrawer }),
            updateCurrentWorkflowRecords: (currentWorkflowRecords) =>
                set({ currentWorkflowRecords: currentWorkflowRecords }),
            updateWorkflowRecords: (workflowRecords) =>
                set({ workflowRecords: workflowRecords }),
            updateSentEmailRecords: (sentEmailRecords) =>
                set({ sentEmailRecords: sentEmailRecords }),
            updateOutllokEmailRecords: (outllokEmailRecords) =>
                set({ outllokEmailRecords: outllokEmailRecords }),
            updateOutlookAccessToken: (outlookAccessToken) =>
                set({ outlookAccessToken: outlookAccessToken }),
            updateGoogleEmailProfile: (googleEmailProfile) =>
                set({ googleEmailProfile: googleEmailProfile }),
            updateGoogleEmailRecords: (googleEmailRecords) =>
                set({ googleEmailRecords: googleEmailRecords }),
            updateGoogleAccessToken: (googleAccessToken) =>
                set({ googleAccessToken: googleAccessToken }),
            updateSelectedImportData: (selectedImportData) =>
                set({ selectedImportData: selectedImportData }),
            updateCalendarEventDialog: (calendarEventDialog) =>
                set({ calendarEventDialog: calendarEventDialog }),
            updateUserRole: (userRole) =>
                set({ userRole: userRole }),
            updateTeamData: (teamData) =>
                set({ teamData: teamData }),
            updateOrganizationName: (organizationName) =>
                set({ organizationName: organizationName }),
            updateUser: (rootuser) =>
                set({ rootuser: rootuser }),
            updateRowsInReport: (rowsInReport) =>
                set({ rowsInReport: rowsInReport }),
            updateIsCommonDrawer: (isCommonDrawer) =>
                set({ isCommonDrawer: isCommonDrawer }),
            updateQuoteMaster: (quotemaster) =>
                set({ quotemaster: quotemaster }),
            updateProductMaster: (productmaster) =>
                set({ productmaster: productmaster }),
            updateNoteMaster: (notemaster) =>
                set({ notemaster: notemaster }),
            updateContactMaster: (contactmaster) =>
                set({ contactmaster: contactmaster }),
            updateOpportunityMaster: (opportunitymaster) =>
                set({ opportunitymaster: opportunitymaster }),
            updateQuotesData: (quotesData) =>
                set({ quotesData: quotesData }),
            updateProductsData: (productsData) =>
                set({ productsData: productsData }),
            updateTaskRowSelected: (taskRowSelected) =>
                set({ taskRowSelected: taskRowSelected }),
            updateTaskData: (taskData) =>
                set({ taskData: taskData }),
            updateIsTaskDrawer: (isTaskDrawer) =>
                set({ isTaskDrawer: isTaskDrawer }),
            updateSelectedSmsList: (selectedSmsList) =>
                set({ selectedSmsList: selectedSmsList }),
            updateIsSmsDrawer: (isSmsDrawer) =>
                set({ isSmsDrawer: isSmsDrawer }),
            updateSelectedEmailList: (selectedEmailList) =>
                set({ selectedEmailList: selectedEmailList }),
            updateUserEmail: (userEmail) =>
                set({ userEmail: userEmail }),
            updateMailSecurityMode: (mailSecurityMode) =>
                set({ mailSecurityMode: mailSecurityMode }),
            updateImapPort: (imapPort) =>
                set({ imapPort: imapPort }),
            updateImapHost: (imapHost) =>
                set({ imapHost: imapHost }),
            updateMailEmail: (mailEmail) =>
                set({ mailEmail: mailEmail }),
            updateMailPassword: (mailPassword) =>
                set({ mailPassword: mailPassword }),
            updateMailUser: (mailUser) =>
                set({ mailUser: mailUser }),
            updateSmtpPort: (smtpPort) =>
                set({ smtpPort: smtpPort }),
            updateSmtpHost: (smtpHost) =>
                set({ smtpHost: smtpHost }),
            updateMailSetupDrawer: (mailSetupDrawer) =>
                set({ mailSetupDrawer: mailSetupDrawer }),
            updateMeetingData: (meetingData) =>
                set({ meetingData: meetingData }),
            updateIsEventDrawer: (isEventDrawer) =>
                set({ isEventDrawer: isEventDrawer }),
            updateIsMailDrawer: (isMailDrawer) =>
                set({ isMailDrawer: isMailDrawer }),
            updateLeadMaster: (leadmaster) =>
                set({ leadmaster: leadmaster }),
            updateUserId: (userId) =>
                set({ userId: userId }),
            updateIform: (iform) =>
                set({ iform: iform }),
            updateRowSelection: (rowSelection) =>
                set({ rowSelection: rowSelection }),
            updateCsvImportFormOpen: (csvImportFormOpen) =>
                set({ csvImportFormOpen: csvImportFormOpen }),
            updateIsClone: (isClone) =>
                set({ isClone: isClone }),
            updateSessionData: (sessionData) =>
                set({ sessionData: sessionData }),
            updateOnboardData: (onboardData) =>
                set({ onboardData: onboardData }),
            updateFormData: (formData) =>
                set({ formData: formData }),
            updateNotesData: (notesData) =>
                set({ notesData: notesData }),
            updateContactData: (contactData) =>
                set({ contactData: contactData }),
            updateAccountData: (accountData) =>
                set({ accountData: accountData }),
            updateLeadData: (leadData) =>
                set({ leadData: leadData }),
            updateLeadFormOpen: (leadFormOpen) =>
                set({ leadFormOpen: leadFormOpen }),
            updateDopen: (dopen) =>
                set({ dopen: dopen }),
        }),
        {
            name: 'formapp-local-storage', // name of the item in the storage (must be unique)
            // storage: createJSONStorage(() => sessionStorage),
            // (optional) by default, 'localStorage' is used
        },
    ),
)

export default useAppStore;