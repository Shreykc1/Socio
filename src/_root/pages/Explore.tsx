import GridPostsList from "@/components/shared/GridPostsList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebouncer";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesandmutations";
import { useState,useRef, useEffect } from "react"
import { useInView } from "react-intersection-observer";

const Explore = () => {
  const { ref, inView } = useInView();
  const { data : posts, fetchNextPage, hasNextPage  } = useGetPosts();
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500)
  const { data : searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue); 

  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
    }
  , [inView,searchValue])
  


  if(!posts) { 
    return(
      <div className="flex-center h-full w-full">
          <Loader/>
      </div>
    )
   }

  const showSearchResults = searchValue !== "";
  const showPosts = !showSearchResults && posts.pages.every((item) => item.documents.length === 0);
  return (
    <div className="explore-container">
        <div className="explore-inner_container">
          <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
          <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
              <img src="/assets/icons/search.svg" alt="" />

              <Input 
                className="explore-search"
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e)=> setSearchValue(e.target.value)}
              />
          </div>
        </div>

        <div className="flex-between w-full max-w-5xl mt-16 mb-7">
          <h3 className="body-bold md:h3-bold">Popular</h3>
          <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                <p className="small-medium md:base-medium text-light-2">All</p>
                <img src="/assets/icons/filter.svg" alt="logo" width={20} height={20} />
          </div>
        </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {
          showSearchResults ? (
            <SearchResults isSearchFetching={isSearchFetching} searchedPosts={searchedPosts} />
          ) : showPosts ?
          (
              <p className="text-light-4 mt-10 text-center w-full">End of Posts</p>
          ) : posts.pages.map((item , index) => {
            return (
              <GridPostsList key={`page-${index}`} posts={item.documents} />
            );
          })
        }
      </div>
        {
          hasNextPage && !searchValue && (
              <div ref={ref} className="mt-10 ">
                  <Loader />
              </div>
          )
        }
    </div>
  )
}

export default Explore