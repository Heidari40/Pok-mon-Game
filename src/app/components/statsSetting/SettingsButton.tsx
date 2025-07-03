import styled from "@emotion/styled";

interface SettingsButtonProps {
    isActive?: boolean;
    children: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    width?: number;
    color?: string;
}

const SettinsButton: React.FC<SettingsButtonProps> = ({
    isActive,
    children,
    onClick,
    width,
    color,
}) =>{
    return(
        <StyleButton
        color={color}
        onClick={onClick}
        type="button"
        isActive={isActive}
        width={width}
        >
          {children}

        </StyleButton>
    )
}
export default SettinsButton;

const StyleButton = styled.button<Pick<SettingsButtonProps, "isActive" | "width" | "color">>`
display: inline-block;
color: white;
background-color: ${({isActive, color}) => (color? color : isActive ? "#EEc272" : "#B38F6A")};
border-radius: 24px;
padding: 10px;
font-size: 18px;
width: ${({width}) => (width ? `${width}px` : "100%")};
cursor: ponter;
`;