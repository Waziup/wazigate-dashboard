import React from "react";

type Props = {
    src: string;
    className: string;
}

export class IconComp extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <svg className={this.props.className}>
                <use xlinkHref={this.props.src}></use>
            </svg>
        );
    }
}