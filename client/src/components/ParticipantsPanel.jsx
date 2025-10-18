// src/components/ParticipantsPanel.jsx

const ParticipantsPanel = ({ participants }) => {
  return (
    <div className="participants-panel">
      <h3>Participants</h3>
      <ul>
        {participants?.map((p) => (
          <li key={p.socketId}>{p.user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantsPanel;
