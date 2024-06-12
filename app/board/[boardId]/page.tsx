import { Room } from "@/components/room";

import WorkSpace from "./_components/workSpace";
import { Loading } from "./_components/loading";

interface BoardIdPageProps {
    params: {
        boardId: string;
    };
};

const BoardIdPage = ({
    params,
}: BoardIdPageProps) => {
    return (
        <Room roomId={params.boardId} fallback={<Loading />}>
            <WorkSpace boardId={params.boardId} />
        </Room>
    );
};

export default BoardIdPage;
