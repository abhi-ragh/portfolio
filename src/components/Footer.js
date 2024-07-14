export default function Footer(){
    return( 
        <nav>
            <ul className="footer">
                <li className="footer--name">find me in: </li>
                <section className="footer--links">
                    <li className="footer--link" id="linkedin"><i class="fa fa-linkedin-square"></i></li>
                    <li className="footer--link" id="insta"><i class="fa fa-instagram"></i></li>
                </section>
                <li className="footer--git"><i class="fa fa-github"></i>abhi-ragh</li>
            </ul>
        </nav>
    )
}