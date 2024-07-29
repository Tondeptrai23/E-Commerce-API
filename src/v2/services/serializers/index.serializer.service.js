import Entity from "baiji-entity";

Entity.types = {
    string: { default: null },
    number: { default: null },
    boolean: { default: null },
    date: { format: "iso", default: null },
};

export default Entity;
