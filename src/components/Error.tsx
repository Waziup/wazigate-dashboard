import * as React from "react";

interface ErrorProps {
    error: any;
}

export const ErrorComp = (props: ErrorProps) => {
    var msg = `${props.error}`;
    var match = msg.match(/^.+?\n/);
    var title = match[0];
    var text = msg.slice(title.length);

    return (
        <div className="error">
            <h2>{title}</h2>
            <pre>{text}</pre>
        </div>
    );
}