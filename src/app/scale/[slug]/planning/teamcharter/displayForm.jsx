import { format } from 'date-fns';

const DisplayForm = ({ rows, dateFormat }) => {

    let formattedEndDate;
    let formattedStartDate;

    if (rows?.expectedEndDate) {
        const expectedEndDate = new Date(rows.expectedEndDate);
        if (!isNaN(expectedEndDate)) {
            formattedEndDate = format(expectedEndDate, dateFormat);
        } else {
            console.error('Invalid date:', rows.expectedEndDate);
        }
    }

    if (rows?.expectedStartDate) {
        const expectedStartDate = new Date(rows.expectedStartDate);
        if (!isNaN(expectedStartDate)) {
            formattedStartDate = format(expectedStartDate, dateFormat);
        } else {
            console.error('Invalid date:', rows.expectedStartDate);
        }
    }

    return (
        <div className="mt-10">
            <div className="p-4 shadow-sm rounded-lg mx-10 mb-14 bg-white">
                <div className="mb-4">
                    <label className="block font-semibold text-[17.5px] text-gray-700">
                        Project Vision
                    </label>
                    <div className="mt-6 text-justify">
                        {rows?.projectVision ? (
                            <div dangerouslySetInnerHTML={{ __html: rows.projectVision }} />
                        ) : (
                            <span>
                                Your project vision goes here.
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4 shadow-sm rounded-lg mx-10 mb-14 bg-white">
                <div className="mb-4">
                    <label className="block font-semibold text-[17.5px] text-gray-700">
                        Project Mission
                    </label>
                    <div className="mt-6 text-justify">
                        {rows?.projectMission ? (
                            <div dangerouslySetInnerHTML={{ __html: rows.projectMission }} />
                        ) : (
                            <span>
                                Your project mission goes here.
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4 shadow-sm rounded-lg mx-10 mb-14 bg-white">
                <div className="mb-4">
                    <label className="block font-semibold text-[17.5px] text-gray-700">
                        Project Description
                    </label>
                    <div className="mt-6 text-justify">
                        {rows?.projectDescription ? (
                            <div dangerouslySetInnerHTML={{ __html: rows.projectDescription }} />
                        ) : (
                            <span>Your project description goes here.</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4 shadow-sm rounded-lg mx-10 mb-14 bg-white">
                <div className="mb-4">
                    <label className="block font-semibold text-[17.5px] text-gray-700">
                        Project Requirements
                    </label>
                    <div className="mt-6 text-justify">
                        {rows?.projectRequirements ?
                            (
                                <div dangerouslySetInnerHTML={{ __html: rows.projectRequirements }} />
                            )
                            : (
                                <span>
                                    Your project requirements goes here.
                                </span>
                            )}
                    </div>
                </div>
            </div>
            <div className="p-4 shadow-sm rounded-lg mx-10 mb-14 bg-white">
                <div className="mb-4">
                    <label className="block font-semibold text-[17.5px] text-gray-700">
                        Project Milestones
                    </label>
                    <div className="mt-6 text-justify">
                        {rows?.projectRequirements ?
                            (
                                <div dangerouslySetInnerHTML={{ __html: rows.milestones }} />
                            )
                            : (
                                <span>
                                    Your project milestones goes here.
                                </span>
                            )}
                    </div>
                </div>
            </div>
            {/* <div className="p-4 shadow-sm rounded-lg mx-10 mb-14 bg-white">
                <div className="mb-4">
                    <label className="block font-semibold text-[17.5px] text-gray-700">
                        Start Date
                    </label>
                    <div className="mt-6 text-justify">
                        {formattedStartDate ? (
                            <span>{formattedStartDate}</span>
                        ) : (
                            <span>No start date available</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4 shadow-sm rounded-lg mx-10 mb-14 bg-white">
                <div className="mb-4">
                    <label className="block font-semibold text-[17.5px] text-gray-700">
                        End Date
                    </label>
                    <div className="mt-6 text-justify">
                        {formattedEndDate ? (
                            <span>{formattedEndDate}</span>
                        ) : (
                            <span>No end date available</span>
                        )}
                    </div>
                </div>
            </div> */}
            <div className="p-4 shadow-sm rounded-lg mx-10 mb-14 bg-white">
                <div className="mb-4">
                    <label className="block font-semibold text-[17.5px] text-gray-700">
                        Project Goals
                    </label>
                    <div className="mt-6 text-justify">
                        {rows?.successCriteria ?
                            (
                                <div dangerouslySetInnerHTML={{ __html: rows.goals }} />
                            )
                            : (
                                <span>
                                    Your project goals goes here.
                                </span>
                            )}
                    </div>
                </div>
            </div>
            <div className="p-4 shadow-sm rounded-lg mx-10 mb-14 bg-white">
                <div className="mb-4">
                    <label className="block font-semibold text-[17.5px] text-gray-700">
                        Success Criteria
                    </label>
                    <div className="mt-6 text-justify">
                        {rows?.successCriteria ?
                            (
                                <div dangerouslySetInnerHTML={{ __html: rows.successCriteria }} />
                            )
                            : (
                                <span>
                                    Your success criteria goes here.
                                </span>
                            )}
                    </div>
                </div>
            </div>
            <div className="p-4 shadow-md rounded-lg mx-10 mb-6 bg-white">
                <div className="mb-4">
                    <label className="block font-semibold text-[17.5px] text-gray-700">
                        Rules of Conduct
                    </label>
                    <div className="mt-6 text-justify">
                        {rows?.rulesOfConduct ? (
                            <div dangerouslySetInnerHTML={{ __html: rows.rulesOfConduct }} />
                        ) : (
                            <span>Your rules of conduct goes here.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayForm;
