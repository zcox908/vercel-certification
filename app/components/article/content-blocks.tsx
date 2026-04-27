import Image from "next/image";
import type { ContentBlock } from "@/lib/news-api-types";

type Props = {
  blocks: ContentBlock[];
};

export default function ContentBlocks({ blocks }: Props) {
  return (
    <div className="flex flex-col gap-5 leading-7 text-zinc-800 dark:text-zinc-200">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return <p key={i}>{block.text}</p>;
          case "heading":
            return block.level === 2 ? (
              <h2 key={i} className="text-2xl font-semibold mt-4">
                {block.text}
              </h2>
            ) : (
              <h3 key={i} className="text-xl font-semibold mt-2">
                {block.text}
              </h3>
            );
          case "blockquote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-zinc-400 pl-4 italic text-zinc-700 dark:text-zinc-300"
              >
                {block.text}
              </blockquote>
            );
          case "unordered-list":
            return (
              <ul key={i} className="list-disc pl-6 flex flex-col gap-1">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "ordered-list":
            return (
              <ol key={i} className="list-decimal pl-6 flex flex-col gap-1">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            );
          case "image":
            return (
              <figure key={i} className="my-2">
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={1200}
                  height={675}
                  className="w-full h-auto rounded-md"
                />
                {block.caption && (
                  <figcaption className="text-xs text-zinc-500 mt-1 text-center">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
        }
      })}
    </div>
  );
}
