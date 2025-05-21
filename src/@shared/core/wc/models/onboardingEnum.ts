export enum InvoiceCycleEnum {
    Weekly = 1,
    BiWeekly = 2,
    Monthly = 3,
    BiMonthly = 4,
}

export enum InvoiceCycleNameEnum {
    Weekly = "Weekly",
    BiWeekly = "Bi-Weekly",
    Monthly = "Monthly",
    BiMonthly = "Bi-Monthly",
}

export class InvoiceCycle {
    public InvoiceCycle = [
        { label: "Weekly", value: 1 },
        { label: "Bi-Weekly", value: 2 },
        { label: "Monthly", value: 3 },
        { label: "Bi-Monthly", value: 4 }
    ];
    public InvoiceTerms = [
        { label: "Net 15", value: 1 },
        { label: "Net 30", value: 2 },
        { label: "Net 45", value: 3 },
        { label: "Net 60", value: 4 },
        { label: "Net 90", value: 5 }
    ]
}

export enum InvoiceTermsEnum {
    Net15 = 1,
    Net30 = 2,
    Net45 = 3,
    Net60 = 4,
    Net90 = 5,
}

export enum InvoiceTermsNameEnum {
    Net15 = "Net 15",
    Net30 = "Net 30",
    Net45 = "Net 45",
    Net60 = "Net 60",
    Net90 = "Net 90",
}
