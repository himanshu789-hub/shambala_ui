import { SchemeDTO } from "Types/DTO";
import FetchList from 'Containers/FetchList/FetchList';
import { EmptyTableBody, Heading } from "Components/Miscellaneous/Miscellaneous";
import SchemeService from "Services/SchemeService";
import { SchemeKey } from "Enums/Enum";
import { getValidSchemeValue } from 'Utilities/Utilities';


function getSchemeNameByValue(Key: SchemeKey): string {
    if (Key === SchemeKey.PERCENTAGE)
        return "PRECENTAGE";
    else if (Key === SchemeKey.CARET)
        return "CARET";
    else if (Key === SchemeKey.BOTTLE)
        return "BOTTLE";
    return "";
}
const ShowSchemeList = (props: { data: SchemeDTO[] }) => {
    return <div className="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Title</th>
                    <th>Offer Type</th>
                    <td>Offer Quota</td>
                </tr>
            </thead>
            <tbody>
                {props.data.length > 0 ? props.data.map((e, index) => <tr>
                    <td>{index + 1}</td>
                    <td>{e.Title}</td>
                    <td>{getSchemeNameByValue(e.SchemeType)}</td>
                    <td>{getValidSchemeValue(e.SchemeType, e.Value)}</td>
                </tr>) : <EmptyTableBody numberOfColumns={4} />}
            </tbody>
        </table>
    </div>;
}
const S = new SchemeService();
export default function SchemeSearchList() {
    const endPoint = S.GetAllByName.bind(S);
    return <div>
        <Heading label="Search A Scheme" />
        <FetchList<SchemeDTO> fetchAllByName={endPoint} render={(data) => <ShowSchemeList data={data} />} />
    </div>
}