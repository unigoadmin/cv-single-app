export class AccountTypes {
    public DirectClient = [
        { label: "Managed Service Provider (MSP)", value: 2 },
        { label: "Implementation Partner (IP)", value: 3 },
        { label: "Referral Vendor", value: 8 }
    ];
    public ThirdPartyClient = [
        { label: "Managed Service Provider (MSP)", value: 2 },
        { label: "Implementation Partner (IP)", value: 3 },
        { label: "Sub Prime Vendor", value: 5 },
        { label: "Referral Vendor", value: 8 }
    ]
    public ReferralPlacementClient = [
        { label: "Managed Service Provider (MSP)", value: 2 },
        { label: "Implementation Partner (IP)", value: 3 },
        { label: "Sub Prime Vendor", value: 5 },
        { label: "Prime Vendor", value: 4 }
    ]
    public CandidateC2C = [
        { label: "Sub Vendor", value: 7 },
        { label: "Referral Vendor", value: 8 }
    ]
    public PlacementRefferal = [
        { label: "Referral Vendor", value: 8 }
    ]
    public EmployementType = [
        { label: "C2C", value: "C2C" },
        { label: "1099", value: "1099" },
        { label: "W2", value: "W2" }
    ]
    public workStatusFields = [
        { label: 'CPT', value: 'CPT' },
        { label: 'E-3',value:'E-3'},
        { label: 'GC', value: 'GC' },
        { label: 'GC-EAD', value: 'GC-EAD' },
        { label: 'H-1B', value: 'H-1B' },
        { label: 'H4-EAD', value: 'H4-EAD' },
        { label: 'L-1A', value: 'L-1A' },
        { label: 'L-1B', value: 'L-1B' },
        { label: 'L2-EAD', value: 'L2-EAD' },
        { label: 'OPT-EAD', value: 'OPT-EAD' },
        { label: 'Requires Visa',value:'Requires Visa'},
        { label: 'STEM-EAD', value: 'STEM-EAD' },
        { label: 'USC', value: 'USC' },
        { label: 'TN', value: 'TN' }
    ]
    public JobsworkStatusFields = [
        { label: 'CPT', value: 'CPT' },
        { label: 'E-3',value:'E-3'},
        { label: 'GC', value: 'GC' },
        { label: 'GC-EAD', value: 'GC-EAD' },
        { label: 'H-1B', value: 'H-1B' },
        { label: 'H4-EAD', value: 'H4-EAD' },
        { label: 'L-1A', value: 'L-1A' },
        { label: 'L-1B', value: 'L-1B' },
        { label: 'L2-EAD', value: 'L2-EAD' },
        { label: 'OPT-EAD', value: 'OPT-EAD' },
        { label: 'Requires Visa',value:'Requires Visa'},
        { label: 'STEM-EAD', value: 'STEM-EAD' },
        { label: 'USC', value: 'USC' },
        { label: 'Open to All', value: 'Open to All' },
        { label: 'TN', value: 'TN' }
    ]
    public EducationQualifications = [
        { Value: 'Bachelors', Name: 'Bachelors' },
        { Value: 'Masters', Name: 'Masters' },
        { Value: 'Not Specified', Name: 'Not Specified' },
    ]
    public CandidateStatus =[
        { value: 1, label: 'New', styleClass:'bg-gray' },
        { value: 2, label: 'InProgress',styleClass:'bg-amber' },
        { value: 3, label: 'Hired',styleClass:'bg-green' },
        { value: 4, label: 'Reject',styleClass:'bg-red' },
        { value: 5, label: 'Hold',styleClass:'bg-amber' },
        { value: 10, label: 'Draft',styleClass:'bg-yellow' },
    ]

    public ThirdPartyClientList = [
        { label: "End Client", value: 1 },
        { label: "Prime Vendor", value: 4 },
        { label: "Managed Service Provider (MSP)", value: 2 },
        { label: "Implementation Partner (IP)", value: 3 },
        { label: "Sub Prime Vendor", value: 5 },
        { label: "Referral Vendor", value: 8 }
    ]

    public ApplicantStatusList = [
        { label: "New", value: 1 },
        { label: "Under Review", value: 2 },
        { label: "Under Mgr Review", value: 3 },
        { label: "Shortlisted", value: 4 },
        { label: "Submitted", value: 5 },
        { label: "Rejected", value: 6 },
        { label: "Ignored", value: 7 },
        { label: "Deleted", value: 8 },
    ]
    public StatusColorList = [
        { label: "Red",  bgclass: "text-red bg-red-light", value:"bg-red" },
        { label: "Green", bgclass: "text-green bg-green-light",value:"bg-green" },
        { label: "Amber", bgclass: "text-amber bg-amber-light",value:"bg-amber" },
        { label: "Gray", bgclass: "text-gray bg-gray-light",value:"bg-gray" },
        { label: "Purple", bgclass: "text-purple bg-purple-light",value:"bg-purple" },
        { label: "Cyan", bgclass: "text-cyna bg-cyan-light",value:"bg-cyan" },
        { label: "Yellow", bgclass: "text-yellow bg-yellow-light",value:"bg-yellow"}
    ]

    public RequisitionStatusList = [
        { label: "Pending Approval", value: 1,bgdisplay: "bg-amber"},
        { label: "Active", value: 2 ,bgdisplay: "bg-green"},
        { label: "Halted", value: 3, bgdisplay: "bg-gray"},
        { label: "Closed", value: 4 ,bgdisplay: "bg-gray"},
    ]

    public RequisitionSubmissionStatusList = [
        { label: "Submitted", value: 1,bgdisplay: "bg-gray"}, 
        { label: "Shortlisted", value: 2 ,bgdisplay: "bg-amber"}, 
        { label: "Interviewed", value: 3, bgdisplay: "bg-cyan"},
        { label: "Selected", value: 4 ,bgdisplay: "bg-green"}, 
    ]

    public JobsHotListColumns = [
        { id: 1, Label: 'JobId',Property:'UniqueJobId'},
        { id: 2, Label: 'JobTitle',Property:'JobTitle' },
        { id: 3, Label: 'Description',Property:'Description' },
        { id: 4, Label: 'Category',Property:'Category' },
        { id: 5, Label: 'JobType',Property:'JobType' },
        { id: 6, Label: 'Location',Property:'Location' }
    ]

    public ChatSystemPrompts = [
        {
            id: 1,
            value: "You are a helpful assistant that can extract and analyze information from resumes. The following is a candidate's resume. Please use this content to answer any follow-up questions about the candidate's background, skills, education, etc."
        },
        {
            id: 2,
            value: "Summarize the candidate's career progression and notable achievements in 5-7 bullet points, focusing on leadership, innovation, and problem-solving skills."
          }
    ];
    

}