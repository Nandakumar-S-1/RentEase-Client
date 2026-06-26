import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { X } from "lucide-react";

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  userName: string;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  roomName,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl h-[80vh] bg-[color:var(--color-surface)] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)]">
          <h2 className="text-lg font-bold text-[color:var(--color-foreground)]">
            Property Tour - {roomName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 bg-black">
          <JitsiMeeting
            roomName={roomName}
            userInfo={{
              displayName: userName,
              email: "",
            }}
            configOverwrite={{
              startWithAudioMuted: true,
              startWithVideoMuted: false,
            }}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
              iframeRef.style.width = "100%";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
