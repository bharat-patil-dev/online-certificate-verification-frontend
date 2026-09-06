import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = ({
    children,
    role = "INSTITUTION",
    activeItem = "Dashboard",
    userName,
}) => {
    return (
        <div className="min-h-screen bg-gray-50 flex">

            <Sidebar
                role={role}
                activeItem={activeItem}
            />

            <div className="flex-1 min-w-0">

                <Topbar
                    userName={userName}
                    role={role}
                />

                <main className="p-8">
                    {children}
                </main>

            </div>
        </div>
    );
};

export default AppLayout;