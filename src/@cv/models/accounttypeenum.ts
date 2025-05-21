export enum AccountTypesEnum{
    EndClient = 1,
    ManagedServiceProvider = 2,
    ImplementationPartner = 3,
    PrimeVendor=4,
    SubPrimeVendor=5,
    Vendor=6,
    SubVendor=7,
    ReferralVendor=8
}

export enum AccountTypeNameEnum{
    EndClient = "End Client",
    ManagedServiceProvider = "Managed Service Provider (MSP)",
    ImplementationPartner = "Implementation Partner (IP)",
    PrimeVendor= "Prime Vendor",
    SubPrimeVendor= "Sub Prime Vendor",
    Vendor= "Vendor",
    SubVendor= "Sub Vendor",
    ReferralVendor= "Referral Vendor"
}

export class UserModules{
   public static TalentCentral = "404A5725-4FB7-470D-AC0F-6AD1086A6C3B";
   public static WorkerCentral = "D1F78D81-5F25-4F43-BF71-86BE16823816";
   public static Admin="4AB1C7D0-F8DE-4C23-A263-8932B6074E85";
   public static Docvault="324DE4D0-09D6-4D72-AA8A-8BD530570955";
   public static JobCentral="D1605CE5-4500-44F4-8ED9-7D40A2F25594";
}

export class UserRoles{
    public static Administrator = "D1A88F30-2EB8-4798-9F67-EC2B38F92A51";
    public static Recruiter = "7AD81680-8583-46BD-B0F4-282E18D8A313";
    public static Interviewer = "C7F31CA8-4740-4E3F-976E-7C521266C860";
    public static Schedular = "FABBC394-5390-4B0D-BD45-009068777FBB";
    public static NoAccess = "E6E989EF-2607-4393-AA7C-005E0DFF1386";
    public static Member = "FABBC394-5390-4B0D-BD45-009068777FBB";
    public static Instructor = "5BAD3EEA-B860-4CE5-9595-FAAE1F241F04";
    public static Manager = "DFB3B2AC-AC7B-4AE9-8BA2-A68210F32A3E";
    public static BulkMailAccess = "6CA8E864-368A-466C-8C5D-279A37C2E668";
    public static RecruiterManager = "225E0CF9-FAC8-4DC4-9EA5-1749CC0DE573";
    public static SalesManager = "5D6C4B7C-4133-46B9-9252-2B008A951E10";
    public static SalesRecruiter = "CF95CF17-8638-471C-9931-DC4260528879";  //SalesExecutive
    public static RecruiterAccess = "32D0B87C-8F83-4699-882C-58A227F5F650";
    public static TrainingAccess = "E2140D76-1F3E-4577-BF41-A7F2FB92AF0F";
    public static RecruiterwithSales = "36B6ADFD-AE64-4552-9355-094ACF7C3FD7";
    public static HRManager = "FEC140FD-B839-4BFE-8F47-B695ECD43BB8";
    public static FinanceManager = "CF6506D7-28CE-48C2-BDA8-A4D6D038BDA0";
    public static TrainingManager = "1BB31050-0A6F-458D-949E-C47A53F6D72B";
}

