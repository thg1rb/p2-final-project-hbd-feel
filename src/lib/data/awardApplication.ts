export type Requirement = {
    id: string;
    name: string;
    required: boolean;
};

export type Award = {
    id: number;
    name: string;
    requirements: Requirement[];
};

export const awards: Award[] = [
    {
        id: 1,
        name: "ด้านกิจกรรมเสริมหลักสูตร",
        requirements: [
            { id: "req_001", name: "สำเนาบัตรประชาชน", required: true },
            { id: "req_002", name: "Transcript", required: true }
        ]
    },
    {
        id: 2,
        name: "ด้านความคิดสร้างสรรค์และนวัตกรรม",
        requirements: [
            { id: "req_001", name: "สำเนาบัตรประชาชน", required: true },
            { id: "req_002", name: "Transcript", required: true }
        ]
    },
    {
        id: 3,
        name: "ด้านความประพฤติดี",
        requirements: [
            { id: "req_001", name: "สำเนาบัตรประชาชน", required: true },
            { id: "req_002", name: "Transcript", required: true },
            { id: "req_003", name: "หนังสือรับรองความประพฤติ", required: true }
        ]
    }
];