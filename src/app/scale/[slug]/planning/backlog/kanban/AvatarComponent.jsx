import Avatar from "react-avatar";

const nameColors = {
    "Features": "#003971",
    "Story": "#335e00",
    "Bugs": "#5d0300",
    "Technical Debt": "#004789",
    "Proof of Concept": "#b5b500",
    "Spikes": "#bb027a",
    "Enablers": "#9f057b",
    "Technical Improvement": "#4a4a4a",
    "Improvement": "#048147"
};

const AvatarComponent = ({ name }) => {
    return <Avatar
        name={name}
        textSizeRatio={2.5}
        round
        size="30"
        color={nameColors[name]}
    />
};

export default AvatarComponent;
