export default function Nav(){
    return(
        <nav>
            <ul className="navbar">
                <li className="navbar--name">abhiragh a r</li>
                <section className="navbar--links">
                    <li className="navbar--link" id="hello">./hello</li>
                    <li className="navbar--link" id="about-me">./about_me</li>
                    <li className="navbar--link" id="projects">./projects</li>
                </section>
                <li className="navbar--contact">./contact_me</li>
            </ul>
        </nav>
    )
}