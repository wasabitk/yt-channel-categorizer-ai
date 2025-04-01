
import { YoutubeChannel } from "@/types";
import ResultsTable from "@/components/ResultsTable";

interface ResultsSectionProps {
  channels: YoutubeChannel[];
}

const ResultsSection = ({ channels }: ResultsSectionProps) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      <ResultsTable channels={channels} />
    </section>
  );
};

export default ResultsSection;
