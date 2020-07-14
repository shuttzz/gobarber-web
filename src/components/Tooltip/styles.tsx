import styled from "styled-components";

export const Container = styled.div`
    position: relative;

    span {
        width: 160px;
        background: #ff9000;
        padding: 8px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.4s;
        visibility: hidden;

        position: absolute;
        bottom: calc(100% + 12px);
        left: 50%; // Essa linha e a linha de baixo  servem para deixar o span alinhado ao centro do ícone, é um hack para fazer a centralização
        transform: translateX(-50%);

        color: #312e38;

        // Aqui vai ficar o código para mostrar um triângulo logo abaixo do tooltip
        &::before {
            content: ''; // Para que tudo isso seja mostrado em tela eu preciso colocar esse content mesmo que seja vazio
            border-style: solid;
            border-color: #ff9000 transparent;
            border-width: 6px 6px 0 6px;
            top: 100%;
            position: absolute;
            left: 50%; // Essa linha e a linha de baixo  servem para deixar o span alinhado ao centro do ícone, é um hack para fazer a centralização
            transform: translateX(-50%);
        }
    }

    &:hover span {
        opacity: 1;
        visibility: visible;
    }
`;
