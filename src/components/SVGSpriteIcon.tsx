import React from "react";

type Props = {
    src: string;
    className?: string;
}

export default function SVGSpriteIcon({src, className}: Props) {
    return (
        <svg className={className || null}>
            <use xlinkHref={src}></use>
        </svg>
    )
}