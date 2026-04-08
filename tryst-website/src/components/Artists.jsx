const artists = [
  { name: "B Praak", genre: "Pop", image: "https://via.placeholder.com/400" },
  { name: "Jassie Gill", genre: "Punjabi", image: "https://via.placeholder.com/400" },
  { name: "Milind Gaba", genre: "Pop", image: "https://via.placeholder.com/400" },
  { name: "Ikka", genre: "Hip Hop", image: "https://via.placeholder.com/400" },
  { name: "Nikk", genre: "Pop", image: "https://via.placeholder.com/400" },
  { name: "Antariksh", genre: "Electronic", image: "https://via.placeholder.com/400" },
];

export default function Artists() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {artists.map((artist, index) => (
        <div
          key={index}
          className="relative rounded-xl overflow-hidden group cursor-pointer"
        >
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
          />

          <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-4">
            <h2 className="text-xl font-bold">{artist.name}</h2>
            <p className="text-yellow-400 text-sm">{artist.genre}</p>
          </div>
        </div>
      ))}
    </div>
  );
}