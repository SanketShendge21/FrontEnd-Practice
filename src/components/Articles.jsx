import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";

const Articles = (props) => {
	const [query, setQuery] = useState("");
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [typeOptions, setTypeOptions] = useState([]);
	const [dateOptions, setDateOptions] = useState([]);
	const [locationOptions, setLocationOptions] = useState([]);
	const [page, setPage] = useState(1);
	const [totalResults, setTotalResults] = useState(0);
	const [found, setFound] = useState(false)

	const search = async (e) => {
		try {
			e.preventDefault();
			setLoading(true)
			props.setProgress(10);
			const url = `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?search=${query}`;
			let response = await fetch(url);
			let data = await response.json();
			if(data !== 'Not Found'){
				setFound(true)
				setArticles(data);
				setTotalResults(data.length);
			}
			else{
				setFound(false)
			}
			setLoading(false);
			props.setProgress(100);
		} catch (error) {
			console.error("Error fetching data:", error);
			setLoading(false);
			props.setProgress(100);
		}
	};

	const getArticles = async () => {
		props.setProgress(10);
		const url = `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?page=${page}`;
		try {
			let response = await fetch(url);
			let data = await response.json();
			setArticles(data);
			setLoading(false);
			props.setProgress(50);

			// Extract unique types from data
			const uniqueTypes = [...new Set(data.map((item) => item.type))];
			const uniqueLocation = [...new Set(data.map((loc) => loc.location))];
			const uniqueYears = [...new Set(data.map((item) => new Date(item.date * 1000).getFullYear()))];

			setDateOptions(uniqueYears);
			setTypeOptions(uniqueTypes);
			setLocationOptions(uniqueLocation);
			setTotalResults(data.length);
			props.setProgress(100);
		} catch (error) {
			console.error("Error fetching data:", error);
			setLoading(false);
			props.setProgress(100);
		}
	};

	const filterByDate = (e) => {
		const selectedYear = e.target.value;
		if (!selectedYear) {
			getArticles();
		} else {
			const filteredByDate = articles.filter((article) => {
				const articleYear = new Date(article.date * 1000).getFullYear();
				return articleYear === parseInt(selectedYear);
			});
			setArticles(filteredByDate);
			setLoading(false);
		}
	};

	const filterByType = async (e) => {
		const selectedValue = e.target.value;

		if (!selectedValue) {
			setArticles([]);
			setLoading(true);
			getArticles();
		} else {
			props.setProgress(10);
			const url = `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?filter=${selectedValue}`;

			try {
				let response = await fetch(url);
				let data = await response.json();
				setArticles(data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setLoading(false);
			}

			props.setProgress(100);
		}
	};
	const handlePrevClick = async () => {
		console.log("clicked");
		const newPage = page > 1 ? page - 1 : 1;
		setPage(newPage);
		await getArticles();
	};

	const handleNextClick = async () => {
		console.log("clicked");
		const newPage = page <= 1 ? page + 1 : 1;
		setPage(newPage);
		await getArticles();
	};

	useEffect(() => {
		document.title = `Wellness Retreats`;
		getArticles();
	}, []);

	const handleOnChange = (e) => {
		setQuery(e.target.value);
	};

	const convertDate = (timestamp) => {
		const date = new Date(timestamp * 1000);

		const month = date.toLocaleString("default", { month: "long" });
		const year = date.getFullYear();

		const startDay = date.getDate();
		const endDay = startDay + 5; // Assuming a range of 5 days
		const dateRange = `${month} ${startDay}-${endDay}, ${year}`;

		return dateRange;
	};

	return (
		<>
			<div className="flex m-8">
				<select
					className="text-white m-2 bg-turquoise hover:bg-turquoise focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-turquoise dark:hover:bg-turquoise dark:focus:ring-blue-800"
					onChange={filterByDate}
				>
					<option value="">Filter by Date</option>
					{dateOptions.map((option, index) => {
						return (
							<option key={index} value={option}>
								{option}
							</option>
						);
					})}
				</select>
				<select
					className="text-white m-2 bg-turquoise hover:bg-turquoise focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-turquoise dark:hover:bg-turquoise dark:focus:ring-blue-800"
					onChange={filterByType}
				>
					<option value="">Filter by Type</option>
					{typeOptions.map((option, index) => {
						return (
							<option key={index} value={option}>
								{option}
							</option>
						);
					})}
				</select>
				<select
					className="text-white m-2 bg-turquoise hover:bg-turquoise focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-turquoise dark:hover:bg-turquoise dark:focus:ring-blue-800"
					onChange={filterByType}
				>
					<option value="">Filter by Location</option>
					{locationOptions.map((option, index) => {
						return (
							<option key={index} value={option}>
								{option}
							</option>
						);
					})}
				</select>

				<form className="max-w-lg ml-auto" onSubmit={search}>
					<label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
						Search
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
							<svg
								className="w-4 h-4 text-gray-500 dark:text-gray-400"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 20"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
								/>
							</svg>
						</div>
						<input
							type="search"
							id="default-search"
							name="query"
							onChange={handleOnChange}
							value={query}
							className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Search "
							required
						/>
						<button
							type="submit"
							className="text-white absolute end-2.5 bottom-2.5 bg-turquoise hover:bg-turquoise focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-turquoise dark:hover:bg-turquoise dark:focus:ring-blue-800"
						>
							Search
						</button>
					</div>
				</form>
			</div>

			{loading && <Spinner />}
			<div>
				{found ? (
					<div className="m-8 container mx-auto">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{articles.map((element) => (
								<div key={element.id} className="bg-peach shadow-md rounded-lg overflow-hidden relative">
									<div className="flex justify-end absolute right-0 m-2">
										<span className="badge rounded-full bg-red-500 text-white px-2 py-1">{element.location}</span>
									</div>
									<img
										src={element.image ? element.image : "https://assets.api.uizard.io/api/cdn/stream/36675273-a053-4f8e-8386-403ea8c2ed84.png"}
										className="w-full h-48 object-cover"
										alt={element.title}
									/>
									<div className="p-4">
										<h5 className="text-lg font-bold mb-2">{element.title ? element.title.slice(0, 45) : ""}</h5>
										<p className="text-gray-700 mb-4">{element.description ? element.description.slice(0, 90) : ""}</p>
										<p className="text-gray-500">
											<small>
												{`Price: ${element.price}`} <br />
												{`Date: ${convertDate(element.date)}`}
											</small>
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className="m-8 container mx-auto text-center text-xl font-bold">Page Not Found</div>
				)}

				{found && (
					<div className="m-auto mb-4 container flex justify-evenly">
						<button
							type="button"
							disabled={page <= 1}
							className="text-white disabled:bg-slate-500 bg-turquoise font-medium rounded-lg text-sm px-4 py-2 cursor-pointer"
							onClick={handlePrevClick}
						>
							&larr; Previous
						</button>

						<button
							type="button"
							disabled={page + 1 >= Math.ceil(totalResults / 6)}
							className="text-white disabled:bg-slate-500 bg-turquoise font-medium rounded-lg text-sm px-4 py-2 cursor-pointer"
							onClick={handleNextClick}
						>
							Next &rarr;
						</button>
					</div>
				)}
			</div>
		</>
	);
};

export default Articles;
