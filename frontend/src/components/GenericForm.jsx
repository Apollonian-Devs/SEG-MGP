import React from "react";

const GenericForm = ({ onSubmit, className, method="post", children, ...props }) => {

    return (
        <form className={className} onSubmit={onSubmit} method={method} {...props}>
            <div>
                {children}
            </div>
        </form>
    );
}

export default GenericForm;