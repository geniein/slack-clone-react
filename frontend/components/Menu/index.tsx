import React, { CSSProperties, FC } from 'react';
import {CloseModalButton, CreateMenu} from './styles';
interface Props {
    show: boolean;
    onCloseModal: () => void;
    style:CSSProperties;
    closeButton?: boolean;
}
const Menu: FC<Props> =({children, style, show, onCloseModal, closeButton}) =>{
    return(
        <CreateMenu onClick={onCloseModal}>
            <div style={style}>
                {closeButton &&<CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
                {children}                
            </div>  
            {children}    
        </CreateMenu>
    );
};
Menu.defaultProps ={
    closeButton: true,
};

export default Menu; 