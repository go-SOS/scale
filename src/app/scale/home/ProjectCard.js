"use client";
import { useSession } from "next-auth/react";
import { format } from 'date-fns';
import InviteCard from "./InviteCard";

const ProjectCard = ({ project, members, handleinvited }) => {
    const { data: session } = useSession();
    const dateFormat = session?.data?.dateFormat;

    // Filter the members based on the project slug and include administrators
    const projectMembers = members.filter(member =>
        member.projectSlug === project.projectSlug || member.role === 'Administrator'
    );

    return (
        <div className="min-w-full mx-auto shadow-sm rounded-lg overflow-hidden mb-10 py-3">
            <div>
                <div className="px-6 py-4">
                    <div className="text-[24px] font-semibold text-center mb-5">
                        {project?.projectName} / {project?.projectKey}
                    </div>
                </div>
                <div className="mx-4 px-4 border bg-white border-slate-200 rounded-lg shadow-sm">
                    <div className="py-3">
                        <div className="font-semibold mb-6 text-lg">
                            Team members
                        </div>
                        <div className="overflow-x-auto border rounded-md border-slate-300">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="px-4 py-2 font-semibold text-left">Name</th>
                                        <th className="px-4 py-2 font-semibold text-left">Email</th>
                                        <th className="px-4 py-2 font-semibold text-left">Role</th>
                                        <th className="px-4 py-2 font-semibold text-left">Invited</th>
                                        <th className="px-4 py-2 font-semibold text-left">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projectMembers.map(member => (
                                        <tr key={member._id} className="border-t">
                                            <td className="px-4 py-2 border text-left">{member.fullName}</td>
                                            <td className="px-4 py-2 border text-left">{member.email}</td>
                                            <td className="px-4 py-2 border text-left">{member.role}</td>
                                            <td className="px-4 py-2 border text-left">{member.isInvited ? <span>Invited</span> : <span> - </span>}</td>
                                            <td className="px-4 py-2 border text-left">{member.isJoined ? <span>Joined</span> : <span>Not Joined</span>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
            {session?.data?.role === "Administrator" && (
                <div className="mx-4 px-4 border bg-white border-slate-200 rounded-lg mt-14 shadow-sm">
                    <div className="font-semibold text-lg mb-8 mt-4">
                        Invite Team Members
                    </div>
                    <InviteCard projectName={project?.projectName} projectSlug={project?.projectSlug} handleinvited={handleinvited} />
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
