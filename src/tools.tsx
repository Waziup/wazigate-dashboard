import * as React from "react";

export function field(label: string, content: JSX.Element) {
    return (
        <div className="details-field">
            <div className="details-name">{label}</div>
            <div className="details-value">{content}</div>
        </div>
    );
}

export function fieldML(label: string, content: JSX.Element) {
    return (
        <div className="details-field">
            <div className="details-name">{label}</div>
            {content}
        </div>
    );
}
